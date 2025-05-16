
import { useState, useCallback } from 'react';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { solanaService } from '@/services/solana';
import { TokenWithPrice } from '@/types/wallet';

/**
 * Hook for fetching and managing wallet data
 */
export function useWalletData() {
  const [tokens, setTokens] = useState<TokenWithPrice[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  
  const { reportError } = useErrorReporting();
  
  // Load token data for a wallet address
  const loadWalletData = useCallback(async (walletAddress: string) => {
    if (!walletAddress) {
      console.log("Δεν υπάρχει διεύθυνση πορτοφολιού για φόρτωση δεδομένων");
      return;
    }
    
    setIsLoadingTokens(true);
    
    try {
      console.log('Φόρτωση δεδομένων πορτοφολιού για διεύθυνση:', walletAddress);
      
      // Get SOL balance
      try {
        console.log("Λήψη υπολοίπου SOL...");
        const balance = await solanaService.fetchSOLBalance(walletAddress);
        console.log('Ελήφθη υπόλοιπο SOL:', balance);
        setSolBalance(balance);
      } catch (balanceError) {
        console.error('Σφάλμα λήψης υπολοίπου SOL:', balanceError);
        reportError(balanceError);
      }
      
      // Get token data - This would be implemented in the real app
      // Here we're just using mock data for demonstration
      // In the real application this would call solanaService.fetchTokens() or similar
      
      // Simulate token data for now
      const mockTokens = [
        { symbol: 'SOL', name: 'Solana', amount: solBalance, price: 100, value: solBalance * 100 },
        { symbol: 'USDC', name: 'USD Coin', amount: 150.25, price: 1, value: 150.25 }
      ];
      
      setTokens(mockTokens);
      
      // Simulate token prices
      const mockPrices = {
        SOL: 100,
        USDC: 1
      };
      
      setTokenPrices(mockPrices);
      
      console.log("Η φόρτωση δεδομένων πορτοφολιού ολοκληρώθηκε");
    } catch (err: any) {
      console.error('Σφάλμα φόρτωσης δεδομένων πορτοφολιού:', err);
      reportError(err);
    } finally {
      setIsLoadingTokens(false);
    }
  }, [reportError]);
  
  // Select token for trading
  const selectTokenForTrading = useCallback((token: string) => {
    console.log("Επιλογή token για συναλλαγή:", token);
    // Implementation would set the selected token for trading
    // This is a mock placeholder function to match the original API
  }, []);
  
  return {
    tokens,
    tokenPrices,
    isLoadingTokens,
    solBalance,
    loadWalletData,
    selectTokenForTrading
  };
}
