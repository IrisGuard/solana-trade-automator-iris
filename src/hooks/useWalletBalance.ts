
import { useCallback } from 'react';
import { solanaService } from '@/services/solanaService';
import { useWalletStatus } from './useWalletStatus';

export function useWalletBalance() {
  const { walletAddress, setBalance } = useWalletStatus();

  // Helper function to load and set balance
  const fetchAndSetBalance = useCallback(async (address: string) => {
    try {
      const fetchedBalance = await solanaService.getSolBalance(address);
      setBalance(fetchedBalance);
      return fetchedBalance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
      return 0;
    }
  }, [setBalance]);

  // Get current SOL balance for the connected wallet
  const getBalance = useCallback(async () => {
    if (!walletAddress) return 0;
    return fetchAndSetBalance(walletAddress);
  }, [walletAddress, fetchAndSetBalance]);

  return {
    fetchAndSetBalance,
    getBalance
  };
}
