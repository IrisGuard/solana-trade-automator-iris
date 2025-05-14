
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/wallet';
import { toast } from 'sonner';
import { transactionsService } from './transactionsService';

/**
 * Service for managing transaction operations
 */
export const transactionService = {
  /**
   * Get transactions from the database for a specific wallet address
   */
  async getTransactionsFromDatabase(address: string, userId: string | undefined, limit = 10): Promise<Transaction[]> {
    try {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_address', address)
        .eq('user_id', userId)
        .order('block_time', { ascending: false })
        .limit(limit);
          
      if (!error && data) {
        // Transform from Supabase format to Transaction type
        return data.map(dbTx => ({
          signature: dbTx.signature,
          blockTime: dbTx.block_time ? new Date(dbTx.block_time).getTime() : Date.now(),
          timestamp: dbTx.block_time ? new Date(dbTx.block_time).getTime() : Date.now(), // Προσθήκη υποχρεωτικού timestamp
          type: dbTx.type,
          status: dbTx.status,
          amount: dbTx.amount,
          from: dbTx.source,
          to: dbTx.destination,
          tokenAddress: undefined
        }));
      }
      
      return [];
    } catch (err) {
      console.error('Error fetching transactions from database:', err);
      return [];
    }
  },
  
  /**
   * Save a transaction to the database
   */
  async saveTransactionToDatabase(
    transaction: Transaction, 
    walletAddress: string, 
    userId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          signature: transaction.signature,
          wallet_address: walletAddress,
          user_id: userId,
          type: transaction.type,
          status: transaction.status,
          amount: String(transaction.amount || ''), // Μετατροπή σε string
          source: transaction.from,
          destination: transaction.to,
          block_time: transaction.blockTime ? new Date(transaction.blockTime).toISOString() : new Date().toISOString()
        });
        
      if (error) {
        console.error('Error saving transaction to database:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Exception when saving transaction:', err);
      return false;
    }
  }
};
