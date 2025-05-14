
import { useState, useCallback, useEffect, useRef } from 'react';
import { useWalletBalance } from './useWalletBalance';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { Token } from '@/types/wallet';

/**
 * Hook για τη διαχείριση των συνδυασμένων δεδομένων wallet (balance + tokens)
 */
export function useWalletData() {
  const { solBalance, loadSolBalance } = useWalletBalance();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, { price: number, priceChange24h: number }>>({});
  const { reportError } = useErrorReporting();
  
  // Θα παρακολουθούμε τον χρόνο του τελευταίου αιτήματος για να αποφύγουμε πολύ συχνές κλήσεις
  const lastRequest = useRef<number>(0);
  
  // Ελάχιστο διάστημα μεταξύ διαδοχικών αιτημάτων (10 δευτ)
  const MIN_REQUEST_INTERVAL = 10000;

  // Mock function for selecting a token for trading
  const selectTokenForTrading = (tokenAddress: string) => {
    console.log(`Selected token for trading: ${tokenAddress}`);
    // Implementation would go here in the future
  };

  // Mock function to load wallet tokens
  const loadWalletTokens = async (address: string) => {
    if (!address) return;
    console.log(`Loading tokens for wallet: ${address}`);
    setLoading(true);
    try {
      // Mock implementation - in a real app, this would fetch from an API
      const mockTokens: Token[] = [
        {
          address: 'So11111111111111111111111111111111111111112',
          name: 'Solana',
          symbol: 'SOL',
          amount: 1.5,
          decimals: 9
        },
        {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          name: 'USD Coin',
          symbol: 'USDC',
          amount: 100,
          decimals: 6
        }
      ];
      setTokens(mockTokens);
    } catch (err) {
      console.error('Error loading tokens:', err);
      setError('Failed to load tokens');
    } finally {
      setLoading(false);
    }
  };
  
  // Φόρτωση όλων των δεδομένων wallet σε μία κλήση
  const loadWalletData = useCallback(async (address: string) => {
    if (!address) return;
    
    const now = Date.now();
    // Έλεγχος αν έχει περάσει αρκετός χρόνος από το τελευταίο αίτημα
    if (now - lastRequest.current < MIN_REQUEST_INTERVAL) {
      console.log("Throttling wallet data requests, skipping this request");
      return;
    }
    
    lastRequest.current = now;
    console.log("Loading wallet data for address:", address);
    
    try {
      // Φόρτωση SOL balance
      await loadSolBalance(address);
      
      // Φόρτωση tokens
      await loadWalletTokens(address);
      
      setError(null);
    } catch (err) {
      console.error('Error loading wallet data:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Σφάλμα φόρτωσης δεδομένων πορτοφολιού: ${errorMessage}`);
      reportError(new Error(`Σφάλμα φόρτωσης δεδομένων wallet: ${errorMessage}`));
    }
  }, [loadSolBalance, reportError]);

  // Ανανέωση δεδομένων wallet
  const refreshWalletData = useCallback(async (walletAddress: string, isConnected: boolean) => {
    if (!isConnected || !walletAddress) return;
    
    const now = Date.now();
    // Έλεγχος αν έχει περάσει αρκετός χρόνος από το τελευταίο αίτημα
    if (now - lastRequest.current < MIN_REQUEST_INTERVAL) {
      console.log("Throttling refresh requests, skipping this refresh");
      return;
    }
    
    lastRequest.current = now;
    console.log("Refreshing wallet data...");
    await loadWalletData(walletAddress);
  }, [loadWalletData]);

  return {
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens: loading,
    error,
    loadWalletData,
    refreshWalletData,
    selectTokenForTrading,
    loadWalletTokens
  };
}
