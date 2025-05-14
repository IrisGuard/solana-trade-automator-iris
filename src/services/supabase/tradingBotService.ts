
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { BotConfig } from '@/hooks/trading-bot/types';

export interface TradingBot {
  id: string;
  user_id: string;
  name: string;
  strategy: string;
  active: boolean;
  config: BotConfig;
  created_at?: string;
  updated_at?: string;
}

export interface BotTransaction {
  id: string;
  bot_id: string;
  transaction_type: 'buy' | 'sell';
  amount: number;
  token_symbol: string;
  price?: number;
  signature?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at?: string;
}

export const tradingBotService = {
  // Create a new bot
  async createBot(userId: string, name: string, strategy: string, config: BotConfig): Promise<TradingBot | null> {
    try {
      const { data, error } = await supabase
        .from('bots')
        .insert([{
          user_id: userId,
          name,
          strategy,
          active: false,
          config
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as TradingBot;
    } catch (error) {
      console.error('Error creating bot:', error);
      toast.error('Σφάλμα κατά τη δημιουργία του bot.');
      return null;
    }
  },
  
  // Get all bots for a user
  async getUserBots(userId: string): Promise<TradingBot[]> {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TradingBot[];
    } catch (error) {
      console.error('Error fetching user bots:', error);
      toast.error('Σφάλμα κατά τη φόρτωση των bots.');
      return [];
    }
  },
  
  // Update a bot's configuration
  async updateBotConfig(botId: string, config: Partial<BotConfig>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bots')
        .update({
          config,
          updated_at: new Date().toISOString()
        })
        .eq('id', botId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating bot config:', error);
      toast.error('Σφάλμα κατά την ενημέρωση του bot.');
      return false;
    }
  },
  
  // Activate or deactivate a bot
  async setActivityStatus(botId: string, active: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bots')
        .update({
          active,
          updated_at: new Date().toISOString()
        })
        .eq('id', botId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error changing bot activity status:', error);
      toast.error('Σφάλμα κατά την αλλαγή κατάστασης του bot.');
      return false;
    }
  },
  
  // Delete a bot
  async deleteBot(botId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bots')
        .delete()
        .eq('id', botId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting bot:', error);
      toast.error('Σφάλμα κατά τη διαγραφή του bot.');
      return false;
    }
  },
  
  // Record a bot transaction
  async recordTransaction(
    botId: string,
    type: 'buy' | 'sell',
    amount: number,
    tokenSymbol: string,
    price?: number,
    signature?: string
  ): Promise<BotTransaction | null> {
    try {
      const { data, error } = await supabase
        .from('bot_transactions')
        .insert([{
          bot_id: botId,
          transaction_type: type,
          amount,
          token_symbol: tokenSymbol,
          price,
          signature,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as BotTransaction;
    } catch (error) {
      console.error('Error recording transaction:', error);
      toast.error('Σφάλμα κατά την καταγραφή της συναλλαγής.');
      return null;
    }
  },
  
  // Update transaction status
  async updateTransactionStatus(
    transactionId: string,
    status: 'pending' | 'completed' | 'failed'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bot_transactions')
        .update({ status })
        .eq('id', transactionId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      toast.error('Σφάλμα κατά την ενημέρωση της κατάστασης συναλλαγής.');
      return false;
    }
  },
  
  // Get all transactions for a bot
  async getBotTransactions(botId: string): Promise<BotTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('bot_transactions')
        .select('*')
        .eq('bot_id', botId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BotTransaction[];
    } catch (error) {
      console.error('Error fetching bot transactions:', error);
      toast.error('Σφάλμα κατά τη φόρτωση των συναλλαγών.');
      return [];
    }
  }
};
