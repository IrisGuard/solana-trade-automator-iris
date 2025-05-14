
import { useState, useCallback } from 'react';
import { useWalletBalance } from './useWalletBalance';
import { useWalletTokens } from './useWalletTokens';
import { useErrorReporting } from '@/hooks/useErrorReporting';

/**
 * Hook to manage combined wallet data (balance + tokens)
 */
export function useWalletData() {
  const { solBalance, loadSolBalance } = useWalletBalance();
  const { tokens, tokenPrices, isLoadingTokens, loadWalletTokens, selectTokenForTrading } = useWalletTokens();
  const [error, setError] = useState<string | null>(null);
  const { reportError } = useErrorReporting();
  
  // Load all wallet data in one call
  const loadWalletData = useCallback(async (address: string) => {
    if (!address) return;
    
    console.log("Loading wallet data for address:", address);
    try {
      // Load SOL balance
      await loadSolBalance(address);
      
      // Load tokens
      await loadWalletTokens(address);
      
      setError(null);
    } catch (err) {
      console.error('Error loading wallet data:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Σφάλμα φόρτωσης δεδομένων πορτοφολιού: ${errorMessage}`);
      reportError(new Error(`Σφάλμα φόρτωσης δεδομένων wallet: ${errorMessage}`));
    }
  }, [loadSolBalance, loadWalletTokens, reportError]);

  // Refresh wallet data
  const refreshWalletData = useCallback(async (walletAddress: string, isConnected: boolean) => {
    if (!isConnected || !walletAddress) return;
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
