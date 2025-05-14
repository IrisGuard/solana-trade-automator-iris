
import { useState, useCallback } from 'react';
import { TradingBotConfig } from './types';

export function useConfig() {
  // Bot configuration state
  const [config, setConfig] = useState<TradingBotConfig>({
    selectedToken: null,
    tradeAmount: 0.1,
    stopLossPercent: 5,
    takeProfitPercent: 10,
    maxTrades: 5
  });

  // Update config function to partially update the configuration
  const updateConfig = useCallback((newConfig: Partial<TradingBotConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  }, []);

  return {
    config,
    updateConfig
  };
}
