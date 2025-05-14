import { PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';
import { connection, TOKEN_PROGRAM_ID, KNOWN_TOKEN_ADDRESSES, MOCK_PRICES } from './config';
import { fetchSOLBalance } from './walletService';
import { errorCollector } from '@/utils/error-handling/collector';
import { withRateLimitRetry, isRateLimitError } from '@/utils/error-handling/rateLimitHandler';

// Cache for token balances to use as fallback when API is rate limited
const tokenBalanceCache: Record<string, Token[]> = {};

// Export named functions for individual import
export const fetchTokenBalance = async (tokenAddress: string, walletAddress: string): Promise<number> => {
  try {
    return await withRateLimitRetry(async () => {
      // Implementation for getting balance of a specific token
      // This is a placeholder, actual implementation would depend on specific requirements
      return 0;
    }, { endpoint: 'main', maxRetries: 3 });
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
};

export const fetchAllTokenBalances = async (address: string): Promise<Token[]> => {
  try {
    return await withRateLimitRetry(async () => {
      const publicKey = new PublicKey(address);
      
      // Get user's token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      // Transform data to Token[]
      const tokens: Token[] = [];
      
      for (const { account } of tokenAccounts.value) {
        const parsedInfo = account.data.parsed.info;
        const mintAddress = parsedInfo.mint;
        const amount = parsedInfo.tokenAmount.uiAmount;
        
        // Skip tokens with zero balance
        if (amount === 0) continue;
        
        // Find info for known tokens
        const knownToken = Object.entries(KNOWN_TOKEN_ADDRESSES).find(
          ([_, addr]) => addr === mintAddress
        );
        
        tokens.push({
          address: mintAddress,
          name: knownToken ? knownToken[0] : `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
          symbol: knownToken ? knownToken[0] : 'UNKNOWN',
          amount: amount,
          decimals: parsedInfo.tokenAmount.decimals
        });
      }
      
      try {
        // Add native SOL to the token list - handle errors separately
        const solBalance = await fetchSOLBalance(address);
        if (solBalance > 0) {
          tokens.unshift({
            address: 'So11111111111111111111111111111111111111112',
            name: 'Solana',
            symbol: 'SOL',
            amount: solBalance,
            decimals: 9
          });
        }
      } catch (solError) {
        console.log('Could not add SOL balance to tokens list:', solError);
        // Continue without SOL balance
      }
      
      // Cache successful results
      tokenBalanceCache[address] = [...tokens];
      
      return tokens;
    }, { endpoint: 'main', maxRetries: 3 });
  } catch (error) {
    // Check for rate limit errors
    if (isRateLimitError(error)) {
      console.warn('Rate limit encountered when fetching tokens, using cached data if available');
      
      // Use cached data if available
      if (tokenBalanceCache[address] && tokenBalanceCache[address].length > 0) {
        toast.info('Using cached token data due to API rate limits', {
          description: 'Data may not be up-to-date'
        });
        return tokenBalanceCache[address];
      }
      
      // If no cached data, show error and return empty array
      toast.error('Solana API rate limit exceeded. Please try again in a moment.');
    } else {
      // Other errors
      console.error('Error loading tokens:', error);
      toast.error('Failed to load tokens');
    }
    
    // Add to error collector
    errorCollector.captureError(error instanceof Error ? error : new Error('Failed to load tokens'), {
      source: 'client',
      component: 'tokenService',
      details: { action: 'fetchAllTokenBalances', address }
    });
    
    return [];
  }
};

export const fetchTokenPrices = async (tokenAddresses: string[]): Promise<Record<string, { price: number; priceChange24h: number }>> => {
  try {
    const prices: Record<string, { price: number; priceChange24h: number }> = {};
    
    // In a real implementation, we would fetch actual prices from an API
    // This is just a mock implementation
    for (const address of tokenAddresses) {
      if (address in MOCK_PRICES) {
        prices[address] = MOCK_PRICES[address];
      } else {
        prices[address] = { 
          price: Math.random() * 10, 
          priceChange24h: (Math.random() * 2) - 1 
        };
      }
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
};

// Create the token service object for backwards compatibility
const tokenServiceObj = {
  getTokenAccounts: fetchAllTokenBalances,
  getTokenPrice: async (tokenAddress: string): Promise<number> => {
    const prices = await fetchTokenPrices([tokenAddress]);
    return prices[tokenAddress]?.price || 0;
  }
};

export { tokenServiceObj as tokenService };
