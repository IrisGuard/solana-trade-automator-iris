
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
  }
};
