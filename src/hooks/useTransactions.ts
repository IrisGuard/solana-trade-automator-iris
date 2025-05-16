
import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/transaction-types';
import { heliusService } from '@/services/helius/HeliusService';

interface UseTransactionsProps {
  walletAddress: string | null;
  limit?: number;
}

export function useTransactions({ walletAddress, limit = 10 }: UseTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchTransactions = useCallback(async () => {
    if (!walletAddress) {
      setTransactions([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching transactions for wallet: ${walletAddress}, limit: ${limit}`);
      const history = await heliusService.getTransactionHistory(walletAddress, limit);
      setTransactions(history);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  }, [walletAddress, limit]);
  
  // Fetch on mount and when wallet/limit changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  
  const refreshTransactions = useCallback(() => {
    return fetchTransactions();
  }, [fetchTransactions]);
  
  return {
    transactions,
    loading,
    error,
    refreshTransactions
  };
}
