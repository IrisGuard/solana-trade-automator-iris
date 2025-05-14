
import { dbClient } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const botPerformanceService = {
  async updateBotPerformance(botId: string, performance: {
    profit_percentage?: number;
    profit_amount?: number;
    total_trades?: number;
    successful_trades?: number;
  }) {
    try {
      const { data, error } = await dbClient
        .from('bot_performance')
        .insert({
          bot_id: botId,
          ...performance,
          timestamp: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating bot performance:', error);
      toast.error('Αποτυχία ενημέρωσης απόδοσης bot');
      throw error;
    }
  },
  
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
