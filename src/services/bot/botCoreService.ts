
import { supabase, dbClient } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { BotConfig, BotRow } from './types';
import { toast } from 'sonner';

export const botCoreService = {
  async createBot(botData: {
    name: string;
    strategy: string;
    active?: boolean;
    config?: BotConfig;
    user_id: string;
  }): Promise<{ bot?: BotRow; error?: Error }> {
    try {
      const newBotData = {
        name: botData.name,
        strategy: botData.strategy,
        active: botData.active || false,
        config: botData.config || {},
        user_id: botData.user_id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('bots')
        .insert(newBotData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast?.success('Bot created successfully');
      return { bot: data as BotRow };
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'botCoreService',
        source: 'createBot',
        details: { botData }
      });
      
      toast?.error('Failed to create bot');
      return { error: error as Error };
    }
  },

  async updateBot(
    botId: string,
    updateData: {
      name?: string;
      strategy?: string;
      active?: boolean;
      config?: BotConfig;
    }
  ): Promise<{ success?: boolean; error?: Error }> {
    try {
      const updatedBotData = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('bots')
        .update(updatedBotData)
        .eq('id', botId);

      if (error) {
        throw error;
      }

      toast?.success('Bot updated successfully');
      return { success: true };
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'botCoreService',
        source: 'updateBot',
        details: { botId, updateData }
      });
      
      toast?.error('Failed to update bot');
      return { error: error as Error };
    }
  },

  async getBotsByUser(userId: string): Promise<{ bots?: BotRow[]; error?: Error }> {
    try {
      const { data, error } = await dbClient
        .from('bots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { bots: data as BotRow[] };
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'botCoreService',
        source: 'getBotsByUser'
      });
      
      toast?.error('Failed to fetch bots');
      return { error: error as Error };
    }
  },

  async getBotById(botId: string): Promise<{ bot?: BotRow; error?: Error }> {
    try {
      const { data, error } = await dbClient
        .from('bots')
        .select('*')
        .eq('id', botId)
        .single();

      if (error) {
        throw error;
      }

      return { bot: data as BotRow };
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'botCoreService',
        source: 'getBotById'
      });
      
      toast?.error('Failed to fetch bot details');
      return { error: error as Error };
    }
  },

  async deleteBot(botId: string): Promise<{ success?: boolean; error?: Error }> {
    try {
      const { error } = await dbClient
        .from('bots')
        .delete()
        .eq('id', botId);

      if (error) {
        throw error;
      }

      toast?.success('Bot deleted successfully');
      return { success: true };
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'botCoreService',
        source: 'deleteBot'
      });
      
      toast?.error('Failed to delete bot');
      return { error: error as Error };
    }
  }
};
