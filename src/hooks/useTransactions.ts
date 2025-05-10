import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/wallet';
import { solanaService } from '@/services/solanaService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSupabaseAuth } from './useSupabaseAuth';

export function useTransactions(walletAddress: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);
  const { user } = useSupabaseAuth();

  // Helper function to merge transactions from API and database
  const mergeTransactions = (apiTxs: Transaction[], dbTxs: Transaction[]): Transaction[] => {
    // Create a map of signatures for fast lookup
    const txMap = new Map<string, Transaction>();
    
    // Add all API transactions to the map
    apiTxs.forEach(tx => {
      txMap.set(tx.signature, tx);
    });
    
    // Update or add database transactions
    dbTxs.forEach(tx => {
      // If we already have this transaction from the API, prefer the API data
      // but keep any additional fields from the DB version
      if (txMap.has(tx.signature)) {
        const apiTx = txMap.get(tx.signature)!;
        txMap.set(tx.signature, { ...tx, ...apiTx });
      } else {
        txMap.set(tx.signature, tx);
      }
    });
    
    // Convert map back to array and sort by blockTime (most recent first)
    return Array.from(txMap.values())
      .sort((a, b) => b.blockTime - a.blockTime);
  };
  
  // Load transactions from both API and database
  const loadTransactions = useCallback(async (address: string, limit = 10) => {
    if (!address) return [];
    
    try {
      setIsLoadingTransactions(true);
      
      // First, check for transactions in Supabase if user is logged in
      let dbTxs: Transaction[] = [];
      
      if (user) {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('wallet_address', address)
          .eq('user_id', user.id)
          .order('block_time', { ascending: false })
          .limit(limit);
          
        if (!error && data) {
          // Transform from Supabase format to Transaction type
          dbTxs = data.map(dbTx => ({
            signature: dbTx.signature,
            blockTime: dbTx.block_time ? new Date(dbTx.block_time).getTime() : Date.now(),
            type: dbTx.type,
            status: dbTx.status,
            amount: dbTx.amount,
            from: dbTx.source,
            to: dbTx.destination,
            tokenAddress: undefined
          }));
        }
      }
      
      // Get transactions from Solana API
      const apiTxs = await solanaService.getRecentTransactions(address, limit);
      
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
            await saveTransactionToSupabase(tx, address, user.id);
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
  
  // Save transaction to Supabase
  const saveTransactionToSupabase = async (tx: Transaction, address: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          signature: tx.signature,
          wallet_address: address,
          user_id: userId,
          type: tx.type,
          status: tx.status,
          amount: tx.amount || '',
          source: tx.from,
          destination: tx.to,
          block_time: tx.blockTime ? new Date(tx.blockTime) : new Date()
        });
        
      if (error) {
        console.error('Error saving transaction to database:', error);
      }
    } catch (err) {
      console.error('Exception when saving transaction:', err);
    }
  };

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
