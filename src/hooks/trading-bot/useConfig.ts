
import { useState } from 'react';
import { TradingBotConfig } from './types';

export function useConfig() {
  const [config, setConfig] = useState<TradingBotConfig>({
    selectedToken: null,
    strategy: 'simple',  // Changed from 'dca' to 'simple' to match the allowed types
    tradeAmount: 10,
    buyThreshold: 2,
    sellThreshold: 3,
    stopLoss: 5,
    takeProfit: 8,
    autoRebalance: false, // Changed from 0 to false
    trailingStop: false   // Changed from 0 to false
  });

  const updateConfig = (newConfig: Partial<TradingBotConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  return { config, updateConfig };
}
