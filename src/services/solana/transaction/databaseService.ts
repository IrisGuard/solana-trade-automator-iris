
import { Transaction } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Enhanced database service for transaction storage with better error handling
 */
export async function saveTransactionToDatabase(
  transaction: Transaction, 
  walletAddress: string, 
  userId: string
): Promise<boolean> {
  try {
    console.log('[DB] Saving transaction to database:', transaction.signature);
    
    // Validate required fields
    if (!transaction.signature || !walletAddress || !userId) {
      console.error('[DB] Missing required fields for transaction save');
      return false;
    }
    
    const transactionData = {
      signature: transaction.signature,
      wallet_address: walletAddress,
      user_id: userId,
      type: transaction.type || 'unknown',
      status: transaction.status || 'pending',
      amount: String(transaction.amount || '0'),
      source: transaction.from || null,
      destination: transaction.to || null,
      block_time: transaction.blockTime 
        ? new Date(transaction.blockTime).toISOString() 
        : new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('transactions')
      .insert(transactionData);
      
    if (error) {
      console.error('[DB] Error saving transaction to database:', error);
      toast.error('Αποτυχία αποθήκευσης συναλλαγής στη βάση δεδομένων');
      return false;
    }
    
    console.log('[DB] Transaction saved successfully');
    toast.success('Η συναλλαγή αποθηκεύτηκε επιτυχώς');
    return true;
  } catch (err) {
    console.error('[DB] Exception when saving transaction:', err);
    toast.error('Σφάλμα κατά την αποθήκευση συναλλαγής');
    return false;
  }
}

/**
 * Retrieve user transactions from database
 */
export async function getUserTransactions(userId: string, limit: number = 50): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('[DB] Error fetching user transactions:', error);
      return [];
    }
    
    return data?.map(tx => ({
      signature: tx.signature,
      type: tx.type,
      status: tx.status,
      amount: parseFloat(tx.amount || '0'),
      from: tx.source,
      to: tx.destination,
      blockTime: tx.block_time ? new Date(tx.block_time).getTime() : Date.now()
    })) || [];
  } catch (err) {
    console.error('[DB] Exception when fetching transactions:', err);
    return [];
  }
}

/**
 * Update transaction status
 */
export async function updateTransactionStatus(
  signature: string, 
  status: string, 
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('signature', signature)
      .eq('user_id', userId);
      
    if (error) {
      console.error('[DB] Error updating transaction status:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('[DB] Exception when updating transaction status:', err);
    return false;
  }
}
