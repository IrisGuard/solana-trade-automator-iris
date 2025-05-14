
import { useState, useCallback, useEffect, useRef } from 'react';
import { useWalletBalance } from './useWalletBalance';
import { useWalletTokens } from './useWalletTokens';
import { useErrorReporting } from '@/hooks/useErrorReporting';

/**
 * Hook για τη διαχείριση των συνδυασμένων δεδομένων wallet (balance + tokens)
 */
export function useWalletData() {
  const { solBalance, loadSolBalance } = useWalletBalance();
  const { tokens, tokenPrices, isLoadingTokens, loadWalletTokens, selectTokenForTrading } = useWalletTokens();
  const [error, setError] = useState<string | null>(null);
  const { reportError } = useErrorReporting();
  
  // Θα παρακολουθούμε τον χρόνο του τελευταίου αιτήματος για να αποφύγουμε πολύ συχνές κλήσεις
  const lastRequest = useRef<number>(0);
  
  // Ελάχιστο διάστημα μεταξύ διαδοχικών αιτημάτων (10 δευτ)
  const MIN_REQUEST_INTERVAL = 10000;
  
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
  }, [loadSolBalance, loadWalletTokens, reportError]);

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
    isLoadingTokens,
    error,
    loadWalletData,
    refreshWalletData,
    selectTokenForTrading
  };
}

