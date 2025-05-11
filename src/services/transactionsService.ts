
import { dbClient } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/client';

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
    return data as Tables['transactions'][];
  },

  async getTransactionsByWallet(address: string) {
    const { data, error } = await dbClient
      .from('transactions')
      .select('*')
      .eq('wallet_address', address)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Tables['transactions'][];
  }
};
