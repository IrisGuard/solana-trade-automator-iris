
import { useCallback } from 'react';
import { solanaService } from '@/services/solanaService';
import { useWalletStatus } from './useWalletStatus';
import { useErrorReporting } from './useErrorReporting';

export function useWalletBalance() {
  const walletStatus = useWalletStatus();
  const walletAddress = walletStatus.walletAddress;
  const setBalance = walletStatus.setBalance || (() => {});
  const { reportError } = useErrorReporting();

  // Βοηθητική συνάρτηση για τη φόρτωση και ορισμό του υπολοίπου
  const fetchAndSetBalance = useCallback(async (address: string) => {
    try {
      const fetchedBalance = await solanaService.fetchSOLBalance(address);
      setBalance(fetchedBalance);
      return fetchedBalance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      reportError(new Error(`Error fetching wallet balance: ${String(error)}`));
      setBalance(0);
      return 0;
    }
  }, [setBalance, reportError]);

  // Λήψη τρέχοντος υπολοίπου SOL για το συνδεδεμένο πορτοφόλι
  const getBalance = useCallback(async () => {
    if (!walletAddress) return 0;
    return fetchAndSetBalance(walletAddress);
  }, [walletAddress, fetchAndSetBalance]);

  return {
    fetchAndSetBalance,
    getBalance
  };
}
