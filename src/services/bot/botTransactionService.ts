
import { dbClient } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const botTransactionService = {
  async recordBotTransaction(transaction: {
    bot_id: string;
    transaction_type: string; // buy, sell
    amount: number;
    token_symbol: string;
    price?: number;
    signature?: string;
    status: string; // pending, completed, failed
  }) {
    try {
      const { data, error } = await dbClient
        .from('bot_transactions')
        .insert(transaction)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording bot transaction:', error);
      toast.error('Αποτυχία καταγραφής συναλλαγής');
      throw error;
    }
  },
  
  async getBotTransactions(botId: string) {
    try {
      const { data, error } = await dbClient
        .from('bot_transactions')
        .select('*')
        .eq('bot_id', botId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bot transactions:', error);
      toast.error('Αποτυχία φόρτωσης συναλλαγών bot');
      return [];
    }
  }
};
