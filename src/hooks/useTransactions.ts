
import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/wallet';
import { solanaService } from '@/services/solanaService';
import { toast } from 'sonner';
import { useSupabaseAuth } from './useSupabaseAuth';
import { transactionService } from '@/services/transactionService';
import { mergeTransactions } from '@/utils/transactionUtils';

export function useTransactions(walletAddress: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);
  const { user } = useSupabaseAuth();
  
  // Load transactions from both API and database
  const loadTransactions = useCallback(async (address: string, limit = 10) => {
    if (!address) return [];
    
    try {
      setIsLoadingTransactions(true);
      
      // First, check for transactions in Supabase if user is logged in
      let dbTxs: Transaction[] = [];
      
      if (user) {
        dbTxs = await transactionService.getTransactionsFromDatabase(address, user.id, limit);
      }
      
      // Get transactions from Solana API
      const apiTxs = await solanaService.fetchTransactionHistory(address, limit);
      
      // Merge transactions from both sources
      const mergedTxs = mergeTransactions(apiTxs, dbTxs);
      setTransactions(mergedTxs);
      
      // Save new transactions to database if user is logged in
      if (user) {
        for (const tx of apiTxs) {
          // Check if transaction already exists in dbTxs
          const existsInDb = dbTxs.some(dbTx => dbTx.signature === tx.signature);
          
          if (!existsInDb) {
            // Save to database
            await transactionService.saveTransactionToDatabase(tx, address, user.id);
          }
        }
      }
      
      return mergedTxs;
    } catch (err) {
      console.error('Error fetching transactions:', err);
      toast.error('Σφάλμα κατά τη φόρτωση των συναλλαγών');
      return [];
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [user]);

  // Refresh transactions when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      loadTransactions(walletAddress);
    } else {
      setTransactions([]);
    }
  }, [walletAddress, loadTransactions]);

  // Function to refresh transactions manually
  const refreshTransactions = useCallback(async () => {
    if (walletAddress) {
      toast.loading('Ανανέωση συναλλαγών...');
      await loadTransactions(walletAddress);
      toast.success('Οι συναλλαγές ενημερώθηκαν');
    }
  }, [walletAddress, loadTransactions]);

  return {
    transactions,
    isLoadingTransactions,
    loadTransactions,
    refreshTransactions
  };
}
