import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { connection } from './config';
import { errorCollector } from '@/utils/error-handling/collector';
import { withRateLimitRetry, isRateLimitError } from '@/utils/error-handling/rateLimitHandler';

// Enhanced cache for SOL balances with longer validity period
const solBalanceCache = new Map<string, {
  balance: number;
  timestamp: number;
}>();

// 5-minute cache validity period (increased from previous implementation)
const CACHE_VALIDITY_PERIOD = 5 * 60 * 1000;

// Fallback mock data in case of persistent rate limits
const mockBalances: Record<string, number> = {};

// Check if cache is still valid
const isCacheValid = (address: string): boolean => {
  const cache = solBalanceCache.get(address);
  if (!cache) return false;
  
  return (Date.now() - cache.timestamp) < CACHE_VALIDITY_PERIOD;
};

// Updated balance fetching with improved caching and fallbacks
export const fetchSOLBalance = async (address: string): Promise<number> => {
  // Return from cache if valid (quick response path)
  if (isCacheValid(address)) {
    console.log('Using cached SOL balance for', address);
    return solBalanceCache.get(address)!.balance;
  }
  
  try {
    // Try to get fresh balance with retry logic
    return await withRateLimitRetry(async () => {
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      // Update cache with fresh data and timestamp
      solBalanceCache.set(address, {
        balance: solBalance,
        timestamp: Date.now()
      });
      
      // Also update mock fallback data
      mockBalances[address] = solBalance;
      
      return solBalance;
    }, { 
      endpoint: `sol-balance-${address.substring(0, 8)}`,
      maxRetries: 2 // Reduced retries to fail faster in case of rate limits
    });
  } catch (error) {
    console.warn('Error getting SOL balance:', error);
    
    // First fallback: use cached data even if expired
    const cachedData = solBalanceCache.get(address);
    if (cachedData) {
      console.log('Using expired cached SOL balance due to error');
      return cachedData.balance;
    }
    
    // Second fallback: use mock data if we have it
    if (address in mockBalances) {
      console.log('Using mock SOL balance data');
      return mockBalances[address];
    }
    
    // Last fallback: return default value and collect error
    if (isRateLimitError(error)) {
      // Don't show toast for rate limits, they're handled elsewhere
      console.log('Rate limit hit for SOL balance, using default value');
    } else {
      // Only show error toast for non-rate-limit errors
      toast.error('Failed to get SOL balance', {
        id: 'sol-balance-error'
      });
      
      // Add to error collector
      errorCollector.captureError(new Error('Failed to get SOL balance'), {
        source: 'client',
        component: 'walletService',
        details: { address, error: String(error) }
      });
    }
    
    // Return default if all fallbacks fail
    return 0;
  }
};

// Keep backwards compatibility with existing code
export const walletService = {
  // Get connection instance
  getConnection: () => connection,
  
  // Get SOL balance for a given address
  getSolBalance: fetchSOLBalance,
  
  // Send token functionality (placeholder)
  sendToken: async () => {
    // To be implemented in the future
    toast.error('Token sending functionality has not been implemented yet');
    return false;
  }
};
