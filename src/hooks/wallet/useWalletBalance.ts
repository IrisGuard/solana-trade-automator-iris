
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { fetchSOLBalance } from '@/services/solana/walletService';
import { useErrorReporting } from '@/hooks/useErrorReporting';

/**
 * Hook to manage wallet SOL balance
 */
export function useWalletBalance() {
  const [solBalance, setSolBalance] = useState<number>(0);
  const { reportError } = useErrorReporting();

  // Load SOL balance
  const loadSolBalance = useCallback(async (address: string) => {
    if (!address) return 0;
    
    console.log("Loading SOL balance for address:", address);
    try {
      const balance = await fetchSOLBalance(address);
      setSolBalance(balance);
      console.log("SOL balance loaded:", balance);
      return balance;
    } catch (err) {
      console.error('Error loading SOL balance:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error('Αποτυχία φόρτωσης υπολοίπου SOL');
      reportError(new Error(`Σφάλμα φόρτωσης υπολοίπου SOL: ${errorMessage}`));
      return 0;
    }
  }, [reportError]);

  return {
    solBalance,
    loadSolBalance
  };
}
