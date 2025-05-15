
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { BotRow } from '@/services/bot/types'; 
import { errorCollector } from '@/utils/error-handling/collector';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useBotControl() {
  const { user } = useAuth();
  const [bots, setBots] = useState<BotRow[]>([]);
  const [selectedBot, setSelectedBot] = useState<BotRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all bots for the current user
  const fetchBots = useCallback(async () => {
    if (!user) {
      setBots([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBots(data as BotRow[] || []);
    } catch (err) {
      const capturedError = err instanceof Error ? err : new Error('Failed to fetch bots');
      setError(capturedError);
      errorCollector.captureError(capturedError, {
        component: 'useBotControl',
        source: 'fetchBots'
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load bots on component mount or when user changes
  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  // Toggle bot active status
  const toggleBotStatus = async (botId: string, active: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bots')
        .update({ active })
        .eq('id', botId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setBots(prevBots => 
        prevBots.map(bot => 
          bot.id === botId ? { ...bot, active } : bot
        )
      );

      toast.success(`Bot ${active ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      const capturedError = err instanceof Error ? err : new Error('Failed to update bot status');
      errorCollector.captureError(capturedError, {
        component: 'useBotControl',
        source: 'toggleBotStatus'
      });
      toast.error(`Failed to ${active ? 'activate' : 'deactivate'} bot`);
    }
  };

  // Create a new bot
  const createBot = async (botData: Partial<BotRow>) => {
    if (!user) return null;

    try {
      const fullBotData = {
        ...botData,
        user_id: user.id,
        active: false,
      };

      const { data, error } = await supabase
        .from('bots')
        .insert([fullBotData])
        .select();

      if (error) throw error;

      // Refresh the bots list
      await fetchBots();

      toast.success('Bot created successfully');
      return data && data.length > 0 ? data[0] : null;
    } catch (err) {
      const capturedError = err instanceof Error ? err : new Error('Failed to create bot');
      errorCollector.captureError(capturedError, {
        component: 'useBotControl',
        source: 'createBot'
      });
      toast.error('Failed to create bot');
      return null;
    }
  };

  // Delete a bot
  const deleteBot = async (botId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('bots')
        .delete()
        .eq('id', botId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setBots(prevBots => prevBots.filter(bot => bot.id !== botId));

      toast.success('Bot deleted successfully');
      return true;
    } catch (err) {
      const capturedError = err instanceof Error ? err : new Error('Failed to delete bot');
      errorCollector.captureError(capturedError, {
        component: 'useBotControl',
        source: 'deleteBot'
      });
      toast.error('Failed to delete bot');
      return false;
    }
  };

  return {
    bots,
    selectedBot,
    setSelectedBot,
    loading,
    error,
    fetchBots,
    toggleBotStatus,
    createBot,
    deleteBot
  };
}
