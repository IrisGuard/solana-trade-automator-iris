
import { useCallback } from 'react';
import { solanaService } from '@/services/solanaService';
import { useWalletStatus } from './useWalletStatus';

export function useWalletBalance() {
  const { walletAddress, setBalance } = useWalletStatus();

  // Βοηθητική συνάρτηση για τη φόρτωση και ορισμό του υπολοίπου
  const fetchAndSetBalance = useCallback(async (address: string) => {
    try {
      const fetchedBalance = await solanaService.fetchSOLBalance(address);
      setBalance(fetchedBalance);
      return fetchedBalance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
      return 0;
    }
  }, [setBalance]);

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
