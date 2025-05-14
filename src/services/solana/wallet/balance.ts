
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { connection } from '../config';
import { errorCollector } from '@/utils/error-handling/collector';
import { withRateLimitRetry, isRateLimitError } from '@/utils/error-handling/rateLimitHandler';

// Cache for SOL balances to use as fallback when API is rate limited
const solBalanceCache: Record<string, number> = {};

// Fetch SOL balance for a wallet address
export const fetchSOLBalance = async (address: string): Promise<number> => {
  try {
    return await withRateLimitRetry(async () => {
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      // Cache the result
      solBalanceCache[address] = solBalance;
      
      return solBalance;
    });
  } catch (error) {
    // Check for rate limit errors
    if (isRateLimitError(error)) {
      console.warn('Rate limit encountered when fetching SOL balance, using cached data if available');
      
      // Use cached balance if available
      if (address in solBalanceCache) {
        toast.info('Using cached SOL balance due to API rate limits');
        return solBalanceCache[address];
      }
      
      toast.error('Solana API rate limit exceeded. Please try again in a moment.');
    } else {
      // General error for other cases
      console.error('Error getting SOL balance:', error);
      toast.error('Failed to get SOL balance');
    }
    
    // Add to error collector for further analysis
    errorCollector.addError({
      message: 'Failed to get SOL balance',
      source: 'client',
      stack: String(error),
      details: { address }
    });
    
    return 0;
  }
};
