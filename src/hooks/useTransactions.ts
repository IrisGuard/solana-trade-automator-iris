
import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/wallet';
import { solanaService } from '@/services/solanaService';

export function useTransactions(walletAddress: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);

  // Load transactions from the connected wallet
  const loadTransactions = useCallback(async (address: string, limit = 10) => {
    if (!address) return [];
    
    try {
      setIsLoadingTransactions(true);
      const txs = await solanaService.getRecentTransactions(address, limit);
      setTransactions(txs);
      return txs;
    } catch (err) {
      console.error('Error fetching transactions:', err);
      return [];
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);

  // Refresh transactions when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      loadTransactions(walletAddress);
    } else {
      setTransactions([]);
    }
  }, [walletAddress, loadTransactions]);

  return {
    transactions,
    isLoadingTransactions,
    loadTransactions
  };
}
