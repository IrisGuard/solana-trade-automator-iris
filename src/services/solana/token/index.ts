
import { getParsedTokenAccounts } from './tokenAccounts';
import { fetchTokenPrice } from '../price';
import { Token } from '@/types/wallet';
import { isRateLimitError } from '@/utils/error-handling/rateLimitHandler';
import { toast } from 'sonner';

// Enhanced token cache with expiration
const tokenCache = new Map<string, {
  tokens: Token[];
  timestamp: number;
}>();

// Longer cache validity for tokens (10 minutes)
const TOKEN_CACHE_VALIDITY = 10 * 60 * 1000;

/**
 * Fetches token accounts for a wallet address with improved caching
 * and fallback to prevent repeated API rate limits
 */
export async function fetchAllTokenBalances(walletAddress: string): Promise<Token[]> {
  // Check if we have a valid cache entry
  const cacheEntry = tokenCache.get(walletAddress);
  if (cacheEntry && Date.now() - cacheEntry.timestamp < TOKEN_CACHE_VALIDITY) {
    console.log("Using cached token data for", walletAddress);
    return cacheEntry.tokens;
  }
  
  try {
    // Fetch fresh data
    console.log("Fetching token accounts for", walletAddress);
    const tokens = await getParsedTokenAccounts(walletAddress);
    
    // Update cache
    tokenCache.set(walletAddress, {
      tokens,
      timestamp: Date.now()
    });
    
    return tokens;
  } catch (error) {
    console.error("Error fetching token accounts:", error);
    
    // Use expired cache if available rather than failing
    if (cacheEntry) {
      console.log("Using expired cached token data due to error");
      
      // Show notification only for non-rate-limit errors to avoid spam
      if (!isRateLimitError(error)) {
        toast.warning("Χρησιμοποιούνται cached δεδομένα tokens", {
          id: "token-cache-fallback",
          duration: 3000
        });
      }
      
      return cacheEntry.tokens;
    }
    
    // If all else fails, return empty array
    if (isRateLimitError(error)) {
      toast.info("Τα tokens δεν μπορούν να φορτωθούν λόγω rate limit", {
        id: "token-rate-limit",
        duration: 3000
      });
    }
    
    return [];
  }
}

export const tokenService = {
  getTokenAccounts: fetchAllTokenBalances,
  getTokenPrice: fetchTokenPrice
};
