
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';

export interface TransactionRecord {
  id: string;
  user_id: string;
  wallet_address: string;
  signature: string;
  type: string;
  status: string;
  amount: string;
  source?: string;
  destination?: string;
  block_time?: string;
  created_at: string;
}

export interface TransactionCreateInput {
  wallet_address: string;
  signature: string;
  type: string;
  status: string;
  amount: string;
  source?: string;
  destination?: string;
  block_time?: string;
}

export const transactionsService = {
  /**
   * Get all transactions for a user
   */
  async getUserTransactions(userId: string, limit = 50): Promise<TransactionRecord[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error fetching user transactions'),
        { component: 'transactionsService', source: 'getUserTransactions' }
      );
      return [];
    }
  },
  
  /**
   * Get transactions for a specific wallet
   */
  async getWalletTransactions(walletAddress: string, limit = 50): Promise<TransactionRecord[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error fetching wallet transactions'),
        { component: 'transactionsService', source: 'getWalletTransactions' }
      );
      return [];
    }
  },
  
  /**
   * Save a new transaction
   */
  async saveTransaction(userId: string, transaction: TransactionCreateInput): Promise<TransactionRecord | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: userId,
          ...transaction
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error saving transaction'),
        { component: 'transactionsService', source: 'saveTransaction' }
      );
      return null;
    }
  },
  
  /**
   * Update transaction status
   */
  async updateTransactionStatus(transactionId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status })
        .eq('id', transactionId);
      
      if (error) throw error;
      return true;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error updating transaction status'),
        { component: 'transactionsService', source: 'updateTransactionStatus' }
      );
      return false;
    }
  },
  
  /**
   * Check if a transaction already exists by signature
   */
  async transactionExists(signature: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('signature', signature)
        .single();
      
      if (error) {
        // If error is "No rows found", then transaction doesn't exist
        if (error.message.includes('No rows found')) {
          return false;
        }
        throw error;
      }
      
      return !!data;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error checking transaction existence'),
        { component: 'transactionsService', source: 'transactionExists' }
      );
      return false;
    }
  }
};
