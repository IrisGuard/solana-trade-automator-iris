import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { BotConfig } from './types';

export async function createBot(
  userId: string, 
  name: string, 
  strategy: string,
  config?: BotConfig
) {
  try {
    const newBot = {
      name,
      strategy,
      user_id: userId,
      active: false,
      config: config as unknown as Json,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('bots')
      .insert(newBot)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'botCoreService',
      source: 'createBot',
      details: { userId, name, strategy }
    });
    throw error;
  }
}

export async function getBotById(botId: string) {
  try {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'botCoreService',
      source: 'getBotById',
      details: { botId }
    });
    return null;
  }
}

export async function updateBot(botId: string, updates: {
  name?: string;
  strategy?: string;
  active?: boolean;
  config?: BotConfig;
}) {
  try {
    const botUpdates = {
      ...updates,
      config: updates.config as unknown as Json,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('bots')
      .update(botUpdates)
      .eq('id', botId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'botCoreService',
      source: 'updateBot',
      details: { botId, updates }
    });
    throw error;
  }
}

export const botCoreService = {
  async createBot(userId: string, botData: {
    name: string;
    strategy: string;
    active?: boolean;
    config?: BotConfig;
  }) {
    try {
      const { data, error } = await dbClient
        .from('bots')
        .insert({
          user_id: userId,
          ...botData,
          created_at: new Date().toISOString()
        })
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
