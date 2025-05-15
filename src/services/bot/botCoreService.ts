
import { errorCollector } from '@/utils/error-handling/collector';
import { supabase } from '@/integrations/supabase/client';
import { BotConfig, BotRow, CreateBotParams } from './types';
import { toast } from 'sonner';

export const botCoreService = {
  // Retrieve all bots for a user
  async getAllBots(userId: string): Promise<{ bots: BotRow[], error?: Error }> {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { bots: data as BotRow[] };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch bots');
      errorCollector.captureError(error, {
        component: 'botCoreService',
        source: 'getAllBots',
        severity: 'medium',
        details: { userId }
      });
      
      return { bots: [], error };
    }
  },
  
  // Retrieve a single bot by ID
  async getBotById(botId: string): Promise<{ bot?: BotRow, error?: Error }> {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('id', botId)
        .single();
      
      if (error) throw error;
      
      return { bot: data as BotRow };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch bot');
      errorCollector.captureError(error, {
        component: 'botCoreService',
        source: 'getBotById',
        severity: 'medium',
        details: { botId }
      });
      
      return { error };
    }
  },
  
  // Create a new bot
  async createBot(botData: CreateBotParams): Promise<BotRow | null> {
    try {
      // Insert the new bot
      const { data, error } = await supabase
        .from('bots')
        .insert([botData])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Bot created successfully');
      return data as BotRow;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create bot');
      errorCollector.captureError(error, {
        component: 'botCoreService',
        source: 'createBot',
        severity: 'high',
        details: { botData }
      });
      
      toast.error('Failed to create bot');
      return null;
    }
  },
  
  // Update an existing bot
  async updateBot(botId: string, updates: Partial<BotRow>): Promise<BotRow | null> {
    try {
      const { data, error } = await supabase
        .from('bots')
        .update(updates)
        .eq('id', botId)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Bot updated successfully');
      return data as BotRow;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update bot');
      errorCollector.captureError(error, {
        component: 'botCoreService',
        source: 'updateBot',
        severity: 'medium',
        details: { botId, updates }
      });
      
      toast.error('Failed to update bot');
      return null;
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
      
      toast.success('Bot deleted successfully');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete bot');
      errorCollector.captureError(error, {
        component: 'botCoreService',
        source: 'deleteBot',
        severity: 'medium',
        details: { botId }
      });
      
      toast.error('Failed to delete bot');
      return false;
    }
  }
};
