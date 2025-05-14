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
    }, { maxRetries: 3 });
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
        const knownToken = KNOWN_TOKEN_ADDRESSES[mintAddress];
        
        tokens.push({
          address: mintAddress,
          name: knownToken?.name || `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
          symbol: knownToken?.symbol || 'UNKNOWN',
          amount: amount,
          logo: knownToken?.logo
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
            logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
          });
        }
      } catch (solError) {
        console.log('Could not add SOL balance to tokens list:', solError);
        // Continue without SOL balance
      }
      
      // Cache successful results
      tokenBalanceCache[address] = [...tokens];
      
      return tokens;
    });
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
    errorCollector.captureError(new Error('Failed to load tokens'), {
      source: 'client',
      component: 'tokenService',
      method: 'fetchAllTokenBalances',
      details: { address }
    });
    
    return [];
  }
};

export const fetchTokenPrices = async (tokenAddresses: string[]): Promise<Record<string, number>> => {
  try {
    const prices: Record<string, number> = {};
    
    // In a real implementation, we would fetch actual prices from an API
    // This is just a mock implementation
    for (const address of tokenAddresses) {
      prices[address] = MOCK_PRICES[address] || Math.random() * 10;
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
};

// Keep backwards compatibility with existing code
export const tokenService = {
  getTokenAccounts: fetchAllTokenBalances,
  getTokenPrice: async (tokenAddress: string): Promise<number> => {
    const prices = await fetchTokenPrices([tokenAddress]);
    return prices[tokenAddress] || 0;
  }
};
