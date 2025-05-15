
import { dbClient } from '@/integrations/supabase/client';

// Define a type for database transactions
interface DBTransaction {
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
  created_at?: string;
}

export const transactionsService = {
  async saveTransaction(transaction: any) {
    const { data, error } = await dbClient
      .from('transactions')
      .insert([transaction]);
    
    if (error) throw error;
    return data;
  },
  
  async getTransactionsByUser(userId: string) {
    const { data, error } = await dbClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as DBTransaction[];
  },

  async getTransactionsByWallet(address: string) {
    const { data, error } = await dbClient
      .from('transactions')
      .select('*')
      .eq('wallet_address', address)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as DBTransaction[];
  }
};
