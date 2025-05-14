
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Token } from '@/types/wallet';
import { 
  BotConfig, 
  BotStatus, 
  TokenPriceInfo, 
  ActiveOrder,
  TradingBotHook
} from './trading-bot/types';
import { useWallet } from './useWallet';

export function useTradingBot(): TradingBotHook {
  const { isConnected, tokens: walletTokens } = useWallet();
  
  // Bot configuration
  const [config, setConfig] = useState<BotConfig>({
    amount: 0.1,
    strategy: 'dca', // 'simple' | 'advanced' | 'custom' | 'dca' | 'grid' | 'momentum' | 'arbitrage'
    buyThreshold: 5,
    sellThreshold: 5,
    autoTrading: false,
    maxSlippage: 1
  });
  
  // Bot state
  const [botStatus, setBotStatus] = useState<BotStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState<Token | null>(null);
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<TokenPriceInfo | null>(null);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  
  // Initialize with first token if available
  useEffect(() => {
    if (walletTokens.length > 0 && !selectedTokenDetails) {
      selectToken(walletTokens[0]);
    }
  }, [walletTokens]);
  
  // Update price periodically
  useEffect(() => {
    if (!selectedTokenDetails) return;
    
    const fetchPrice = async () => {
      try {
        // Simulate price fetch - in a real app this would call an API
        const mockPrice: TokenPriceInfo = {
          price: Math.random() * 100,
          priceChange24h: (Math.random() * 10) - 5,
          volume24h: Math.random() * 1000000,
          marketCap: Math.random() * 10000000,
          lastUpdated: new Date()
        };
        
        setSelectedTokenPrice(mockPrice);
      } catch (error) {
        console.error('Failed to fetch price:', error);
      }
    };
    
    fetchPrice();
    
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [selectedTokenDetails]);
  
  // Mock some active orders
  useEffect(() => {
    if (botStatus === 'running' && selectedTokenDetails) {
      const mockOrder: ActiveOrder = {
        id: uuidv4(),
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        amount: config.amount,
        price: selectedTokenPrice?.price || 0,
        token: selectedTokenDetails,
        status: 'pending',
        createdAt: new Date()
      };
      
      setActiveOrders(prev => [...prev, mockOrder]);
      
      // Simulate order completion after some time
      setTimeout(() => {
        setActiveOrders(prev => 
          prev.map(order => 
            order.id === mockOrder.id 
              ? { ...order, status: Math.random() > 0.2 ? 'completed' : 'failed' } 
              : order
          )
        );
      }, 5000);
    }
  }, [botStatus, selectedTokenPrice]);
  
  // Select a token for trading
  const selectToken = (token: Token) => {
    setSelectedTokenDetails(token);
    setSelectedTokenPrice(null); // Reset price to trigger a new fetch
  };
  
  // Update bot configuration
  const updateConfig = (newConfig: Partial<BotConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };
  
  // Start the trading bot
  const startBot = () => {
    if (!selectedTokenDetails) return;
    
    setIsLoading(true);
    
    // Simulate bot startup
    setTimeout(() => {
      setBotStatus('running');
      setIsLoading(false);
      
      // Create a mock buy order
      const buyOrder: ActiveOrder = {
        id: uuidv4(),
        type: 'buy',
        amount: config.amount,
        price: selectedTokenPrice?.price || 0,
        token: selectedTokenDetails,
        status: 'pending',
        createdAt: new Date()
      };
      
      setActiveOrders(prev => [...prev, buyOrder]);
    }, 1500);
  };
  
  // Stop the trading bot
  const stopBot = () => {
    setIsLoading(true);
    
    // Simulate bot shutdown
    setTimeout(() => {
      setBotStatus('idle');
      setIsLoading(false);
      
      // Create a mock sell order
      if (selectedTokenDetails) {
        const sellOrder: ActiveOrder = {
          id: uuidv4(),
          type: 'sell',
          amount: config.amount,
          price: selectedTokenPrice?.price || 0,
          token: selectedTokenDetails,
          status: 'pending',
          createdAt: new Date()
        };
        
        setActiveOrders(prev => [...prev, sellOrder]);
      }
    }, 1500);
  };
  
  return {
    config,
    updateConfig,
    startBot,
    stopBot,
    selectToken,
    isLoading,
    botStatus,
    activeOrders,
    selectedTokenPrice,
    selectedTokenDetails,
    tokens: walletTokens,
    connected: isConnected
  };
}
