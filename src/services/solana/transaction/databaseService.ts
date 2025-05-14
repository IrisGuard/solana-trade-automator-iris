
import { Transaction } from '@/types/wallet';
import { supabase } from '@/integrations/supabase/client';

/**
 * Αποθήκευση συναλλαγής στη βάση δεδομένων
 */
export async function saveTransactionToDatabase(
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
