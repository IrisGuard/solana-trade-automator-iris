
import { useState } from 'react';
import { TradingBotConfig } from './trading-bot/types';

export function useConfig() {
  const [config, setConfig] = useState<TradingBotConfig>({
    selectedToken: null,
    strategy: 'simple',
    tradingAmount: 10,
    tradeAmount: 10,      // Added to match the interface
    buyThreshold: 2,      // Added to match the interface
    sellThreshold: 3,     // Added to match the interface
    stopLoss: 5,
    takeProfit: 8,
    autoRebalance: false,
    trailingStop: false   // Added to match the interface
  });

  const updateConfig = (newConfig: Partial<TradingBotConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  return { config, updateConfig };
}
