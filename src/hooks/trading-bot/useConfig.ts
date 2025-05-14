
import { useState } from 'react';
import { TradingBotConfig } from './types';

export function useConfig() {
  const [config, setConfig] = useState<TradingBotConfig>({
    selectedToken: null,
    strategy: 'simple',
    tradingAmount: 10,
    tradeAmount: 10,
    buyThreshold: 2,
    sellThreshold: 3,
    stopLoss: 5,
    takeProfit: 8,
    autoRebalance: false,
    trailingStop: false
  });

  const updateConfig = (newConfig: Partial<TradingBotConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  return { config, updateConfig };
}
