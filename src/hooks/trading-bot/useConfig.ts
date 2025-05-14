
import { useState } from 'react';
import { TradingBotConfig } from './types';

export function useConfig() {
  const [config, setConfig] = useState<TradingBotConfig>({
    selectedToken: null,
    buyThreshold: 3,
    sellThreshold: 5,
    stopLoss: 10,
    takeProfit: 20,
    maxBudget: 100,
    tradeAmount: 0.1,
    enabledStrategies: {
      dca: true,
      grid: false,
      momentum: false
    }
  });
  
  const updateConfig = (newConfig: Partial<TradingBotConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  };
  
  return {
    config,
    updateConfig
  };
}
