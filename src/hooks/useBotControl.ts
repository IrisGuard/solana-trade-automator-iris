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
  const createBot = async (botData: any) => {
    try {
      // Ensure required fields are present in each bot object
      const botsToCreate = Array.isArray(botData) ? 
        botData.map(bot => ({
          user_id: user?.id || '',
          active: bot.active || false,
          id: bot.id,
          name: bot.name || 'Default Bot Name',  // Ensure name is provided
          strategy: bot.strategy || 'default',   // Ensure strategy is provided
          config: bot.config,
          created_at: bot.created_at,
          updated_at: bot.updated_at
        })) : 
        {
          user_id: user?.id || '',
          active: botData.active || false,
          id: botData.id,
          name: botData.name || 'Default Bot Name',  // Ensure name is provided
          strategy: botData.strategy || 'default',   // Ensure strategy is provided
          config: botData.config,
          created_at: botData.created_at,
          updated_at: botData.updated_at
        };

      const { data, error } = await supabase
        .from('bots')
        .insert(botsToCreate);

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error creating bot:', err);
      return { data: null, error: err };
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
