
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';
import { fetchAllTokenBalances } from '@/services/solana/tokenService';
import { fetchTokenPrices, TokenPriceData } from '@/services/solana/priceService';
import { useErrorReporting } from '@/hooks/useErrorReporting';

/**
 * Hook to manage wallet tokens data
 */
export function useWalletTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const { reportError } = useErrorReporting();

  // Load wallet tokens
  const loadWalletTokens = useCallback(async (address: string) => {
    if (!address) return;
    
    console.log("Loading tokens for address:", address);
    setIsLoadingTokens(true);
    
    try {
      const userTokens = await fetchAllTokenBalances(address);
      setTokens(userTokens);
      console.log(`Loaded ${userTokens.length} tokens`);
      
      if (userTokens.length > 0) {
        const tokenAddresses = userTokens.map(token => token.address);
        const priceData = await fetchTokenPrices(tokenAddresses);
        
        // Convert the TokenPriceData to simple price record
        const simplePrices: Record<string, number> = {};
        
        // Safely extract price values
        Object.entries(priceData).forEach(([address, data]) => {
          if (data && typeof data === 'object' && 'price' in data) {
            simplePrices[address] = data.price;
          }
        });
        
        setTokenPrices(simplePrices);
        console.log("Token prices loaded for", Object.keys(simplePrices).length, "tokens");
      }
      
      return userTokens;
    } catch (err) {
      console.error('Error loading wallet tokens:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error('Αποτυχία φόρτωσης tokens');
      reportError(new Error(`Σφάλμα φόρτωσης tokens: ${errorMessage}`));
      return [];
    } finally {
      setIsLoadingTokens(false);
    }
  }, [reportError]);

  // Select a token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      toast.success(`Επιλέχθηκε το ${token.symbol} για trading`);
      return token;
    }
    return null;
  }, [tokens]);

  return {
    tokens,
    tokenPrices,
    isLoadingTokens,
    loadWalletTokens,
    selectTokenForTrading
  };
}
