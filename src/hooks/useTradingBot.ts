
import { useState, useCallback } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { Token } from '@/types/wallet';

export interface TradingBotConfig {
  selectedToken: string | null;
  strategy: 'simple' | 'advanced' | 'custom' | 'dca' | 'grid' | 'momentum';
  buyThreshold: number;
  sellThreshold: number;
  maxInvestment: number;
  stopLoss: number;
  takeProfit: number;
}

export interface TradingOrder {
  id: string;
  type: 'buy' | 'sell' | 'stop-loss' | 'take-profit';
  price: number;
  amount: number;
  status: 'pending' | 'filled' | 'cancelled';
}

export type BotStatus = 'idle' | 'running' | 'paused' | 'error';

export function useTradingBot() {
  const { tokens, connected } = useWalletConnection();
  
  const [config, setConfig] = useState<TradingBotConfig>({
    selectedToken: null,
    strategy: 'simple',
    buyThreshold: -5,
    sellThreshold: 10,
    maxInvestment: 100,
    stopLoss: -10,
    takeProfit: 20
  });

  const [botStatus, setBotStatus] = useState<BotStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [activeOrders, setActiveOrders] = useState<TradingOrder[]>([]);
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<{ price: number; priceChange24h: number } | null>(null);

  const updateConfig = useCallback((newConfig: Partial<TradingBotConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const selectToken = useCallback(async (tokenAddress: string | null) => {
    setConfig(prev => ({ ...prev, selectedToken: tokenAddress }));
    
    if (tokenAddress) {
      // Mock price data
      setSelectedTokenPrice({
        price: Math.random() * 100 + 10,
        priceChange24h: (Math.random() - 0.5) * 20
      });
    } else {
      setSelectedTokenPrice(null);
    }
  }, []);

  const startBot = useCallback(async () => {
    if (!config.selectedToken) {
      alert('Παρακαλώ επιλέξτε ένα token πρώτα');
      return;
    }
    
    setIsLoading(true);
    setBotStatus('running');
    
    // Simulate bot start
    setTimeout(() => {
      setIsLoading(false);
      console.log('Trading bot started');
    }, 1000);
  }, [config.selectedToken]);

  const stopBot = useCallback(async () => {
    setIsLoading(true);
    setBotStatus('idle');
    
    // Simulate bot stop
    setTimeout(() => {
      setIsLoading(false);
      setActiveOrders([]);
      console.log('Trading bot stopped');
    }, 1000);
  }, []);

  const selectedTokenDetails = tokens?.find(token => token.address === config.selectedToken);

  return {
    config,
    updateConfig,
    selectToken,
    startBot,
    stopBot,
    isLoading,
    botStatus,
    activeOrders,
    selectedTokenPrice,
    selectedTokenDetails,
    tokens: tokens || [],
    // Legacy props for compatibility
    isActive: botStatus === 'running',
    selectedToken: config.selectedToken || '',
    strategy: config.strategy,
    toggleBot: async () => {
      if (botStatus === 'running') {
        await stopBot();
      } else {
        await startBot();
      }
    },
    setStrategy: (strategy: string) => {
      updateConfig({ strategy: strategy as TradingBotConfig['strategy'] });
    },
    availableTokens: tokens || [],
    isConnected: connected
  };
}
