
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';

export interface TransactionRecord {
  id?: string;
  user_id: string;
  signature: string;
  type: string;
  status: string;
  amount: string;
  source?: string;
  destination?: string;
  token?: string;
  wallet_address: string;
  block_time?: string;
  value_usd?: number;
}

class TransactionRecordService {
  // Record a new transaction
  async recordTransaction(transaction: Omit<TransactionRecord, 'id'>): Promise<string | null> {
    try {
      // Check if transaction already exists
      const { data: existingTx } = await supabase
        .from('transactions')
        .select('id')
        .eq('signature', transaction.signature)
        .single();
        
      if (existingTx) {
        console.log('Transaction already recorded:', transaction.signature);
        return existingTx.id;
      }
      
      // Insert new transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select('id')
        .single();
        
      if (error) throw error;
      
      console.log('Transaction recorded:', transaction.signature);
      return data.id;
    } catch (error) {
      console.error('Error recording transaction:', error);
      errorCollector.captureError(error, {
        component: 'TransactionRecordService',
        method: 'recordTransaction',
        details: { signature: transaction.signature }
      });
      return null;
    }
  }
  
  // Get transactions for a wallet address
  async getTransactions(walletAddress: string, limit: number = 50): Promise<TransactionRecord[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('block_time', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      errorCollector.captureError(error, {
        component: 'TransactionRecordService',
        method: 'getTransactions',
        details: { walletAddress }
      });
      return [];
    }
  }
  
  // Get a transaction by signature
  async getTransactionBySignature(signature: string): Promise<TransactionRecord | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('signature', signature)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') { // No results found
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting transaction by signature:', error);
      errorCollector.captureError(error, {
        component: 'TransactionRecordService',
        method: 'getTransactionBySignature',
        details: { signature }
      });
      return null;
    }
  }
  
  // Update transaction status
  async updateTransactionStatus(signature: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status })
        .eq('signature', signature);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      errorCollector.captureError(error, {
        component: 'TransactionRecordService',
        method: 'updateTransactionStatus',
        details: { signature, status }
      });
      return false;
    }
  }
}

// Export singleton instance
export const transactionRecordService = new TransactionRecordService();
