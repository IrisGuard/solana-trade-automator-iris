
import { useState, useEffect } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { useErrorReporting } from './useErrorReporting';
import { Token } from '@/types/wallet';
import { BotStatus, TradingBotConfig, TradingOrder } from './trading-bot/types';

const defaultConfig: TradingBotConfig = {
  selectedToken: null,
  buyThreshold: 3,
  sellThreshold: 5,
  stopLoss: 10,
  takeProfit: 20,
  tradeAmount: 10,
  maxBudget: 100,
  strategy: 'simple',
  autoRebalance: false,
  trailingStop: false,
  enabledStrategies: {
    dca: true,
    grid: false,
    momentum: false
  }
};

export function useTradingBot() {
  const { walletAddress, tokens, isConnected } = useWalletConnection();
  const [config, setConfig] = useState<TradingBotConfig>(defaultConfig);
  const [botStatus, setBotStatus] = useState<BotStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [activeOrders, setActiveOrders] = useState<TradingOrder[]>([]);
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<{ price: number; priceChange24h: number } | null>(null);
  const { reportError } = useErrorReporting();

  // Get selected token details
  const selectedTokenDetails = tokens.find(token => token.address === config.selectedToken);

  // Update config
  const updateConfig = (newConfig: Partial<TradingBotConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  };

  // Select token
  const selectToken = async (tokenAddress: string | null) => {
    try {
      if (tokenAddress) {
        setIsLoading(true);
        // Here we would fetch the latest price data for the token
        // Simulating price data for demo
        setSelectedTokenPrice({
          price: Math.random() * 100,
          priceChange24h: (Math.random() * 20) - 10
        });
        
        updateConfig({ selectedToken: tokenAddress });
      } else {
        updateConfig({ selectedToken: null });
        setSelectedTokenPrice(null);
      }
    } catch (error) {
      reportError(error instanceof Error ? error : new Error('Unknown error selecting token'), { 
        component: 'TradingBot', 
        source: 'client' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start bot
  const startBot = () => {
    try {
      setIsLoading(true);
      
      // Generate some mock orders
      const mockOrders = [
        { 
          id: `order-${Date.now()}-1`,
          type: 'stop-loss',
          price: selectedTokenPrice?.price ? selectedTokenPrice.price * 0.9 : 0,
          amount: 0.5,
          tokenAddress: config.selectedToken || '',
          status: 'pending',
          createdAt: new Date()
        },
        { 
          id: `order-${Date.now()}-2`,
          type: 'take-profit', 
          price: selectedTokenPrice?.price ? selectedTokenPrice.price * 1.2 : 0,
          amount: 0.5,
          tokenAddress: config.selectedToken || '',
          status: 'pending',
          createdAt: new Date()
        }
      ] as any;
      
      setActiveOrders(mockOrders);
      setBotStatus('running');
      
      // Show success message
      console.log("Bot started with config:", config);
    } catch (error) {
      reportError(error instanceof Error ? error : new Error('Unknown error starting bot'), { 
        component: 'TradingBot', 
        source: 'client' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Stop bot
  const stopBot = () => {
    try {
      setIsLoading(true);
      setActiveOrders([]);
      setBotStatus('idle');
      
      // Show success message
      console.log("Bot stopped");
    } catch (error) {
      reportError(error instanceof Error ? error : new Error('Unknown error stopping bot'), { 
        component: 'TradingBot', 
        source: 'client' 
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    tokens,
    connected: isConnected
  };
}
