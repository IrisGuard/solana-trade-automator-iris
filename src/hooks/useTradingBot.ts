
import { useState, useEffect, useCallback } from './react-compatibility';
import { Token } from '@/types/wallet';
import { TradingBotConfig, TradingOrder } from './trading-bot/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Default configuration
const DEFAULT_CONFIG: TradingBotConfig = {
  selectedToken: null,
  buyThreshold: 3,
  sellThreshold: 5,
  tradeAmount: 10,
  stopLoss: 10,
  takeProfit: 15,
  strategy: 'grid', // Fixed from 'simple' to 'grid'
  autoReinvest: false,
  maxBudget: 100,
  trailingStop: false,
  autoRebalance: false
};

export function useTradingBot(tokens: Token[]) {
  const [config, setConfig] = useState<TradingBotConfig>(DEFAULT_CONFIG);
  const [botStatus, setBotStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<{ price: number; priceChange24h: number } | null>(null);
  const [activeOrders, setActiveOrders] = useState<TradingOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update the config
  const updateConfig = useCallback((newConfig: Partial<TradingBotConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  // Select token for trading
  const selectToken = useCallback(async (tokenAddress: string | null) => {
    if (!tokenAddress) {
      setSelectedToken(null);
      updateConfig({ selectedToken: null });
      return;
    }
    
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      setSelectedToken(token);
      updateConfig({ selectedToken: tokenAddress });
      
      // Simulate getting price data
      setSelectedTokenPrice({
        price: 10 + Math.random() * 90,
        priceChange24h: -10 + Math.random() * 20
      });
    }
  }, [tokens, updateConfig]);
  
  // Start the bot
  const startBot = useCallback(() => {
    if (!config.selectedToken) {
      toast.error('Please select a token first');
      return false;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setBotStatus('running');
      toast.success('Bot started successfully');
      
      // Create demo orders
      const stopLossPrice = selectedTokenPrice ? selectedTokenPrice.price * (1 - config.stopLoss / 100) : 0;
      const takeProfitPrice = selectedTokenPrice ? selectedTokenPrice.price * (1 + config.takeProfit / 100) : 0;
      
      const newOrders: TradingOrder[] = [
        {
          id: uuidv4(),
          type: 'stop-loss',
          tokenSymbol: selectedToken?.symbol || '',
          amount: config.tradeAmount,
          price: parseFloat(stopLossPrice.toFixed(4)),
          status: 'open',
          createdAt: new Date().toISOString(),
          token: selectedToken?.symbol || ''
        },
        {
          id: uuidv4(),
          type: 'take-profit',
          tokenSymbol: selectedToken?.symbol || '',
          amount: config.tradeAmount,
          price: parseFloat(takeProfitPrice.toFixed(4)),
          status: 'open',
          createdAt: new Date().toISOString(),
          token: selectedToken?.symbol || ''
        }
      ];
      
      setActiveOrders(newOrders);
      setIsLoading(false);
    }, 1500);
    
    return true;
  }, [config, selectedToken, selectedTokenPrice]);
  
  // Pause the bot
  const pauseBot = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setBotStatus('paused');
      toast.success('Bot paused');
      setIsLoading(false);
    }, 1000);
    
    return true;
  }, []);
  
  // Stop the bot
  const stopBot = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setBotStatus('idle');
      setActiveOrders([]);
      toast.success('Bot stopped');
      setIsLoading(false);
    }, 1000);
    
    return true;
  }, []);
  
  // Effect to update selected token when tokens change
  useEffect(() => {
    if (config.selectedToken) {
      const token = tokens.find(t => t.address === config.selectedToken);
      if (token) {
        setSelectedToken(token);
      }
    }
  }, [tokens, config.selectedToken]);
  
  return {
    config,
    updateConfig,
    botStatus,
    selectedToken,
    selectedTokenPrice,
    activeOrders,
    isLoading,
    selectToken,
    startBot,
    pauseBot,
    stopBot
  };
}
