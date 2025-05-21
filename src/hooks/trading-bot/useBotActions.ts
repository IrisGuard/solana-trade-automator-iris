
import { useState, useCallback } from '../react-compatibility';
import { toast } from 'sonner';
import { BotStatus, BotActionStatus, TradingBotConfig } from './types';

export function useBotActions() {
  const [botStatus, setBotStatus] = useState('idle');
  const [activeBots, setActiveBots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBot, setCurrentBot] = useState(null);
  const [actionStatus, setActionStatus] = useState('idle');
  const [config, setConfig] = useState({
    buyThreshold: 0.02,
    sellThreshold: 0.03,
    stopLoss: 0.05,
    tradeAmount: 100,
    maxOrdersPerDay: 5,
    selectedToken: null,
    interval: 'minute',
    strategy: 'trend',
  });

  // Update configuration with partial changes
  const updateConfig = useCallback((updates) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...updates
    }));
    
    toast.success("Bot configuration updated", {
      description: "Your changes have been saved"
    });
  }, []);

  // Select a token for trading
  const selectToken = useCallback(async (tokenAddress) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      updateConfig({ selectedToken: tokenAddress });
      return true;
    } catch (error) {
      toast.error("Failed to select token");
      console.error("Token selection error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateConfig]);

  // Start a trading bot
  const startBot = useCallback(async () => {
    if (!config.selectedToken) {
      toast.error("Please select a token first");
      return false;
    }
    
    setIsLoading(true);
    try {
      setActionStatus('loading');
      // Simulate starting bot
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBotStatus('running');
      setActionStatus('success');
      toast.success("Trading bot started successfully");
      return true;
    } catch (error) {
      setActionStatus('error');
      toast.error("Failed to start trading bot");
      console.error("Bot start error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [config.selectedToken]);

  // Stop a trading bot
  const stopBot = useCallback(async () => {
    setIsLoading(true);
    try {
      setActionStatus('loading');
      // Simulate stopping bot
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBotStatus('idle');
      setActionStatus('success');
      toast.success("Trading bot stopped successfully");
      return true;
    } catch (error) {
      setActionStatus('error');
      toast.error("Failed to stop trading bot");
      console.error("Bot stop error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    botStatus,
    activeBots,
    isLoading,
    currentBot,
    actionStatus,
    config,
    updateConfig,
    selectToken,
    startBot,
    stopBot
  };
}
