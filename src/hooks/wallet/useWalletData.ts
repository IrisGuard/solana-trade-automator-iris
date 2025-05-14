
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';
import { solanaService } from '@/services/solana';
import { fetchTokens, fetchTokenPrices as fetchTokenPricesService } from '@/services/solana/tokenService';

export function useWalletData() {
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, { price: number, priceChange24h: number }>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);

  // Load wallet data (SOL balance and token balances)
  const loadWalletData = useCallback(async (walletAddress: string) => {
    setIsLoadingBalance(true);
    setIsLoadingTokens(true);
    
    try {
      // Get SOL balance
      const balance = await solanaService.fetchSOLBalance(walletAddress);
      setSolBalance(balance);
      
      // Get token balances
      const userTokens = await fetchTokens();
      setTokens(userTokens);
      
      // Get token prices
      const prices = {};
      for (const token of userTokens) {
        prices[token.address] = {
          price: Math.random() * 100,
          priceChange24h: (Math.random() * 10) - 5
        };
      }
      setTokenPrices(prices);
    } catch (err) {
      console.error('Error loading wallet data:', err);
      toast.error('Σφάλμα φόρτωσης δεδομένων πορτοφολιού');
    } finally {
      setIsLoadingBalance(false);
      setIsLoadingTokens(false);
    }
  }, []);

  // Refresh wallet data
  const refreshWalletData = useCallback(() => {
    if (!tokens.length) return;
    
    loadWalletData(tokens[0].address);
    toast.success('Τα δεδομένα ανανεώθηκαν επιτυχώς');
  }, [tokens, loadWalletData]);

  // Select token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      toast.success(`Επιλέχθηκε το ${token.symbol} για trading`);
      return token;
    }
    return null;
  }, [tokens]);

  return {
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    isLoadingBalance,
    loadWalletData,
    refreshWalletData,
    selectTokenForTrading
  };
}
