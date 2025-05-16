
import { useState, useCallback } from 'react';
import { Token } from '@/types/wallet';
import { TokenPrices } from '@/services/solana/price/types';
import { tokenService } from '@/services/solana/token';

export function useWalletData() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Load wallet data including tokens and prices
  const loadWalletData = useCallback(async (walletAddress: string) => {
    if (!walletAddress) return;
    
    setIsLoadingTokens(true);
    try {
      console.log(`Φόρτωση δεδομένων για το πορτοφόλι: ${walletAddress}`);
      
      // Fetch tokens
      const fetchedTokens = await tokenService.fetchTokens(walletAddress);
      console.log(`Ελήφθησαν ${fetchedTokens.length} tokens`);
      setTokens(fetchedTokens);
      
      // Fetch token prices if there are any tokens
      if (fetchedTokens.length > 0) {
        const tokenAddresses = fetchedTokens.map(token => token.address);
        try {
          const prices = await tokenService.fetchTokenPrices(tokenAddresses);
          setTokenPrices(prices);
        } catch (priceError) {
          console.error('Σφάλμα λήψης τιμών token:', priceError);
        }
      }
    } catch (error) {
      console.error('Σφάλμα φόρτωσης δεδομένων πορτοφολιού:', error);
    } finally {
      setIsLoadingTokens(false);
    }
  }, []);

  // Select token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      setSelectedToken(token);
      return token;
    }
    return null;
  }, [tokens]);

  return {
    tokens,
    tokenPrices,
    isLoadingTokens,
    selectedToken,
    loadWalletData,
    selectTokenForTrading
  };
}
