
import { useState, useCallback } from '../../react-compatibility';
import { TradingBotConfig } from './types';

const DEFAULT_CONFIG: TradingBotConfig = {
  selectedToken: null,
  strategy: 'grid', // Changed from 'simple' to 'grid'
  tradeAmount: 10,
  buyThreshold: 1.0,
  sellThreshold: 2.0,
  stopLoss: 5.0,
  takeProfit: 10.0,
  autoReinvest: false,
  maxBudget: 100,
  trailingStop: false,
  autoRebalance: false,
  enabledStrategies: {
    dca: false,
    grid: false,
    momentum: false
  }
};

/**
 * Hook για τη διαχείριση της διαμόρφωσης του trading bot
 */
export function useConfig() {
  const [config, setConfig] = useState<TradingBotConfig>(DEFAULT_CONFIG);
  
  // Ενημερώνει τις ρυθμίσεις του bot
  const updateConfig = useCallback((newConfig: Partial<TradingBotConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  }, []);
  
  return {
    config,
    updateConfig
  };
}
