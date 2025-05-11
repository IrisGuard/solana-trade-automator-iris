
import { dbClient } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/client';

export const botsService = {
  async createBot(userId: string, botData: any) {
    const { data, error } = await dbClient
      .from('bots')
      .insert([{
        user_id: userId,
        ...botData,
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return data;
  },
  
  async getBotsByUser(userId: string) {
    const { data, error } = await dbClient
      .from('bots')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as Tables['bots'][];
  },
  
  async updateBot(botId: string, updates: any) {
    const { data, error } = await dbClient
      .from('bots')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', botId);
    
    if (error) throw error;
    return data;
  },
  
  async deleteBot(botId: string) {
    const { error } = await dbClient
      .from('bots')
      .delete()
      .eq('id', botId);
    
    if (error) throw error;
    return { success: true };
  }
};
