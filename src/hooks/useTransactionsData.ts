
import { useState, useEffect } from 'react';
import { heliusService } from '@/services/helius/HeliusService';

export function useTransactionsData(walletAddress: string) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const txs = await heliusService.getTransactionHistory(walletAddress, 20);
        setTransactions(txs);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [walletAddress]);
  
  return { transactions, isLoading };
}

// Helper functions
export const getUniqueTokens = (transactions: any[]) => {
  const uniqueTokens = new Set();
  
  transactions.forEach(tx => {
    if (tx.tokenAddress) {
      uniqueTokens.add(tx.tokenAddress);
    }
  });
  
  return Array.from(uniqueTokens);
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};
