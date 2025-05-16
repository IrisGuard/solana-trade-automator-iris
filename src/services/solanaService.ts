
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { toast } from 'sonner';

// Initialize Solana connection
export function getConnection(endpoint = clusterApiUrl('devnet')): Connection {
  return new Connection(endpoint, 'confirmed');
}

// Get SOL balance
export async function getSOLBalance(address: string): Promise<number> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(address);
    
    console.log(`Fetching SOL balance for address: ${address}`);
    const balance = await connection.getBalance(publicKey);
    
    // Convert lamports to SOL
    const solBalance = balance / 1000000000;
    console.log(`SOL balance: ${solBalance}`);
    
    return solBalance;
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    return 0;
  }
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
  }
};
