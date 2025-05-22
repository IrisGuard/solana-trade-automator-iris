import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { toast } from 'sonner';
import { RPC_ENDPOINTS } from '@/utils/error-handling/constants';
import { errorCollector } from '@/utils/error-handling/collector';

// Keep track of endpoint failures
const endpointFailures = new Map<string, number>();

// Initialize Solana connection with fallback mechanism
export function getConnection(endpoint?: string): Connection {
  // Try to use provided endpoint
  let selectedEndpoint = endpoint;
  
  if (!selectedEndpoint) {
    // Use primary endpoint by default, falling back to others if needed
    const primaryFails = endpointFailures.get(RPC_ENDPOINTS.PRIMARY) || 0;
    const backupFails = endpointFailures.get(RPC_ENDPOINTS.BACKUP) || 0;
    
    if (primaryFails > 2 && primaryFails > backupFails) {
      // Switch to backup if primary has failed more
      selectedEndpoint = RPC_ENDPOINTS.BACKUP;
    } else if (backupFails > 2 && primaryFails > 0) {
      // If both have failures, use fallback
      selectedEndpoint = RPC_ENDPOINTS.FALLBACK;
    } else {
      // Default to primary
      selectedEndpoint = RPC_ENDPOINTS.PRIMARY;
    }
  }
  
  console.log(`Creating Solana connection using endpoint: ${selectedEndpoint}`);
  return new Connection(selectedEndpoint, 'confirmed');
}

// Reset a specific endpoint's failure count
export function resetEndpointFailure(endpoint: string): void {
  endpointFailures.set(endpoint, 0);
}

// Record an endpoint failure
function recordEndpointFailure(endpoint: string): void {
  const currentFailures = endpointFailures.get(endpoint) || 0;
  endpointFailures.set(endpoint, currentFailures + 1);
}

// Get SOL balance with retry logic
export async function getSOLBalance(address: string): Promise<number> {
  // Try each endpoint in order until one succeeds
  const endpoints = [RPC_ENDPOINTS.PRIMARY, RPC_ENDPOINTS.BACKUP, RPC_ENDPOINTS.FALLBACK];
  
  let lastError: Error | null = null;
  
  for (const endpoint of endpoints) {
    try {
      const connection = new Connection(endpoint, 'confirmed');
      const publicKey = new PublicKey(address);
      
      console.log(`Fetching SOL balance for address: ${address} using endpoint: ${endpoint}`);
      const balance = await connection.getBalance(publicKey);
      
      // Reset failure count on success
      resetEndpointFailure(endpoint);
      
      // Convert lamports to SOL
      const solBalance = balance / 1000000000;
      console.log(`SOL balance: ${solBalance}`);
      
      return solBalance;
    } catch (error) {
      console.error(`Error getting SOL balance from ${endpoint}:`, error);
      recordEndpointFailure(endpoint);
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }
  
  // If we get here, all endpoints failed
  if (lastError) {
    errorCollector.captureError(lastError, {
      component: 'solanaService',
      method: 'getSOLBalance',
      details: { address }
    });
  }
  
  console.error('All RPC endpoints failed when fetching SOL balance');
  return 0;
}

// Fetch SOL balance (alias for backward compatibility)
export const fetchSOLBalance = getSOLBalance;

// Mock IDL for anchor
export const mockProgramIdl = {
  version: '0.1.0',
  name: 'mock_program',
  instructions: []
};

// The solanaService object for consistent API
export const solanaService = {
  fetchSOLBalance,
  getSOLBalance,
  getConnection,
  
  // Add method to fetch all token balances (delegating to token service)
  fetchAllTokenBalances: async (walletAddress: string) => {
    const { fetchAllTokenBalances } = await import('./solana/token');
    return fetchAllTokenBalances(walletAddress);
  },
  
  // Add method to fetch token prices (delegating to token service)
  fetchTokenPrices: async (tokenAddress: string) => {
    const { tokenService } = await import('./solana/token');
    const prices = await tokenService.fetchTokenPrices([tokenAddress]);
    return prices[tokenAddress];
  },
  
  // Get the current best RPC endpoint
  getCurrentEndpoint: () => {
    const primaryFails = endpointFailures.get(RPC_ENDPOINTS.PRIMARY) || 0;
    const backupFails = endpointFailures.get(RPC_ENDPOINTS.BACKUP) || 0;
    
    if (primaryFails > 2 && primaryFails > backupFails) {
      return RPC_ENDPOINTS.BACKUP;
    } else if (backupFails > 2 && primaryFails > 0) {
      return RPC_ENDPOINTS.FALLBACK;
    }
    return RPC_ENDPOINTS.PRIMARY;
  },
  
  // Test all endpoints and return the fastest one
  testEndpoints: async (): Promise<string> => {
    const results = await Promise.allSettled([
      testEndpoint(RPC_ENDPOINTS.PRIMARY),
      testEndpoint(RPC_ENDPOINTS.BACKUP),
      testEndpoint(RPC_ENDPOINTS.FALLBACK)
    ]);
    
    let fastestEndpoint = RPC_ENDPOINTS.PRIMARY;
    let fastestTime = Infinity;
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.time < fastestTime) {
        fastestTime = result.value.time;
        fastestEndpoint = [RPC_ENDPOINTS.PRIMARY, RPC_ENDPOINTS.BACKUP, RPC_ENDPOINTS.FALLBACK][index];
      }
    });
    
    return fastestEndpoint;
  }
};

// Test an RPC endpoint and return response time
async function testEndpoint(endpoint: string): Promise<{success: boolean, time: number}> {
  const start = performance.now();
  try {
    const connection = new Connection(endpoint, 'confirmed');
    const result = await connection.getVersion();
    const time = performance.now() - start;
    return { success: true, time };
  } catch (error) {
    console.error(`Error testing endpoint ${endpoint}:`, error);
    return { success: false, time: Infinity };
  }
}
