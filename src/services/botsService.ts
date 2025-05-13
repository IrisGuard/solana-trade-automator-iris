
import { dbClient } from '@/integrations/supabase/client';
import type { BotRow, BotConfig } from '@/types/supabase-extensions';
import { toast } from 'sonner';

export const botsService = {
  async createBot(userId: string, botData: {
    name: string;
    strategy: string;
    active?: boolean;
    config?: BotConfig;
  }) {
    try {
      const { data, error } = await dbClient
        .from('bots')
        .insert([{
          user_id: userId,
          ...botData,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating bot:', error);
      toast.error('Αποτυχία δημιουργίας του bot');
      throw error;
    }
  },
  
  async getBotsByUser(userId: string) {
    try {
      const { data, error } = await dbClient
        .from('bots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BotRow[];
    } catch (error) {
      console.error('Error fetching bots:', error);
      toast.error('Αποτυχία φόρτωσης των bots');
      return [];
    }
  },
  
  async updateBot(botId: string, updates: {
    name?: string;
    strategy?: string;
    active?: boolean;
    config?: BotConfig;
  }) {
    try {
      const { data, error } = await dbClient
        .from('bots')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', botId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating bot:', error);
      toast.error('Αποτυχία ενημέρωσης του bot');
      throw error;
    }
  },
  
  async deleteBot(botId: string) {
    try {
      const { error } = await dbClient
        .from('bots')
        .delete()
        .eq('id', botId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting bot:', error);
      toast.error('Αποτυχία διαγραφής του bot');
      throw error;
    }
  },
  
  // Νέα λειτουργία για την καταγραφή συναλλαγών bot
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
        .insert([transaction])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording bot transaction:', error);
      toast.error('Αποτυχία καταγραφής συναλλαγής');
      throw error;
    }
  },
  
  // Νέα λειτουργία για την ενημέρωση μετρικών απόδοσης
  async updateBotPerformance(botId: string, performance: {
    profit_percentage?: number;
    profit_amount?: number;
    total_trades?: number;
    successful_trades?: number;
  }) {
    try {
      const { data, error } = await dbClient
        .from('bot_performance')
        .insert([{
          bot_id: botId,
          ...performance,
          timestamp: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating bot performance:', error);
      toast.error('Αποτυχία ενημέρωσης απόδοσης bot');
      throw error;
    }
  },
  
  // Νέα λειτουργία για την ανάκτηση προτύπων bot
  async getBotTemplates() {
    try {
      const { data, error } = await dbClient
        .from('bot_templates')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bot templates:', error);
      toast.error('Αποτυχία φόρτωσης προτύπων bot');
      return [];
    }
  },
  
  // Νέα λειτουργία για τη δημιουργία bot από πρότυπο
  async createBotFromTemplate(userId: string, templateId: string, customName?: string) {
    try {
      // 1. Ανακτήστε το πρότυπο
      const { data: templates, error: templateError } = await dbClient
        .from('bot_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (templateError) throw templateError;
      
      if (!templates) {
        throw new Error('Template not found');
      }
      
      // 2. Δημιουργήστε ένα νέο bot με βάση το πρότυπο
      const botName = customName || `${templates.name} Bot`;
      const { data, error } = await dbClient
        .from('bots')
        .insert([{
          user_id: userId,
          name: botName,
          strategy: templates.strategy,
          active: false,
          config: templates.default_config,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating bot from template:', error);
      toast.error('Αποτυχία δημιουργίας bot από πρότυπο');
      throw error;
    }
  },
  
  // Νέα λειτουργία για την ανάκτηση συναλλαγών bot
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
  },
  
  // Νέα λειτουργία για την ανάκτηση απόδοσης bot
  async getBotPerformance(botId: string) {
    try {
      const { data, error } = await dbClient
        .from('bot_performance')
        .select('*')
        .eq('bot_id', botId)
        .order('timestamp', { ascending: false })
        .limit(30); // Get the last 30 data points
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bot performance:', error);
      toast.error('Αποτυχία φόρτωσης απόδοσης bot');
      return [];
    }
  }
};
