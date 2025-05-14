
import { useState, useEffect, useCallback } from 'react';
import { solanaService } from '@/services/solanaService';
import { Transaction } from '@/types/transaction';
import { useErrorReporting } from './useErrorReporting';

export interface UseTransactionsProps {
  walletAddress: string | null;
  limit?: number;
}

/**
 * Hook to fetch and manage transaction history for a Solana wallet.
 */
export function useTransactions({ walletAddress, limit: initialLimit = 10 }: UseTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(initialLimit);
  const { reportError } = useErrorReporting();

  // Function to fetch transaction history
  const fetchTransactionsData = async (address: string, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get transactions from database if available
      let dbTxs: Transaction[] = [];
      
      // Get transactions from Solana API
      // Using fetchTransactions instead of fetchTransactionHistory
      const apiTxs = await solanaService.fetchTransactions(address, limit);
      
      // Merge transactions from both sources
      const mergedTransactions = [...apiTxs, ...dbTxs];
      
      // Sort transactions by timestamp in descending order
      mergedTransactions.sort((a, b) => b.timestamp - a.timestamp);
      
      setTransactions(mergedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions');
      reportError(new Error(`Failed to fetch transactions: ${String(error)}`));
    } finally {
      setLoading(false);
    }
  };

  // Load more transactions
  const loadMore = useCallback(() => {
    setLimit(prevLimit => prevLimit + 5);
  }, []);

  // Refresh transactions
  const refreshTransactions = useCallback(() => {
    if (walletAddress) {
      fetchTransactionsData(walletAddress, limit);
    }
  }, [walletAddress, limit]);

  // Fetch transactions on wallet address change or component mount
  useEffect(() => {
    if (walletAddress) {
      fetchTransactionsData(walletAddress, limit);
    } else {
      setTransactions([]);
    }
  }, [walletAddress, limit]);

  return {
    transactions,
    loading,
    error,
    loadMore,
    refreshTransactions
  };
}
