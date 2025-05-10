
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';
import { solanaService } from '@/services/solanaService';

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);

  // Load tokens from the Phantom wallet
  const fetchAndSetTokens = useCallback(async (address: string) => {
    try {
      setIsLoadingTokens(true);
      
      toast.loading('Φόρτωση tokens...');
      
      // Use solanaService to load real tokens
      const userTokens = await solanaService.getTokenAccounts(address);
      setTokens(userTokens);
      
      toast.success('Τα tokens φορτώθηκαν επιτυχώς');
      return userTokens;
    } catch (err) {
      console.error('Error fetching tokens:', err);
      toast.error('Σφάλμα κατά τη φόρτωση των tokens');
      setTokens([]);
      return [];
    } finally {
      setIsLoadingTokens(false);
      toast.dismiss();
    }
  }, []);

  // Select a token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      setSelectedToken(token);
      toast.success(`Επιλέχθηκε το ${token.symbol} για trading`);
      return token;
    }
    return null;
  }, [tokens]);

  // Fetch token prices
  const fetchTokenPrices = useCallback(async () => {
    try {
      if (tokens.length === 0) return;
      
      const prices: Record<string, number> = {};
      
      for (const token of tokens) {
        // Use solanaService to get real prices
        prices[token.address] = await solanaService.getTokenPrice(token.address);
      }
      
      setTokenPrices(prices);
      return prices;
    } catch (error) {
      console.error("Error fetching token prices:", error);
      return {};
    }
  }, [tokens]);

  return {
    tokens,
    selectedToken,
    tokenPrices,
    isLoadingTokens,
    fetchAndSetTokens,
    selectTokenForTrading,
    fetchTokenPrices,
    setSelectedToken
  };
}
