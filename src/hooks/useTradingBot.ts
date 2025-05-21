
import { useState, useEffect, useCallback } from 'react';
import { BotStatus } from './trading-bot/types';

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  balance?: number;
  price?: number;
  amount?: number;
  mint?: string;
}

interface TradingBotConfig {
  strategy: string;
  tokenAddress: string;
  targetPrice: number;
  stopLoss: number;
  leverage: number;
  tradeAmount: number;
  isActive: boolean;
  interval: string;
  selectedToken: string | null;
  buyThreshold: number;
  sellThreshold: number;
  takeProfit: number;
  autoReinvest: boolean;
}

interface TradingOrder {
  id: string;
  tokenSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'pending' | 'executed' | 'cancelled';
  timestamp: string;
}

export function useTradingBot(tokens: Token[] = []) {
  const [config, setConfig] = useState<TradingBotConfig>({
    strategy: 'momentum',
    tokenAddress: '',
    targetPrice: 0,
    stopLoss: 0,
    leverage: 1,
    tradeAmount: 0.1,
    isActive: false,
    interval: '1h',
    selectedToken: null,
    buyThreshold: 5,
    sellThreshold: 5,
    takeProfit: 10,
    autoReinvest: false
  });
  
  const [botStatus, setBotStatus] = useState<BotStatus>('idle');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<number | null>(null);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState<Token | null>(null);
  const [activeOrders, setActiveOrders] = useState<TradingOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update config
  const updateConfig = useCallback((newConfig: Partial<TradingBotConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  // Select token
  const selectToken = useCallback(async (tokenAddress: string) => {
    setSelectedToken(tokenAddress);
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      setSelectedTokenDetails(token);
      setSelectedTokenPrice(token.price || null);
      updateConfig({ selectedToken: tokenAddress });
      console.log("Selected token:", token);
    }
  }, [tokens, updateConfig]);
  
  // Start bot
  const startBot = useCallback(() => {
    if (!selectedToken) {
      console.error("No token selected");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate bot starting process
    setTimeout(() => {
      setBotStatus('running');
      setConfig(prev => ({ ...prev, isActive: true }));
      setIsLoading(false);
      
      // Create some sample orders
      const sampleOrders: TradingOrder[] = [
        {
          id: '1',
          tokenSymbol: selectedTokenDetails?.symbol || 'Unknown',
          type: 'buy',
          amount: config.tradeAmount,
          price: selectedTokenPrice || 0,
          status: 'pending',
          timestamp: new Date().toISOString()
        }
      ];
      
      setActiveOrders(sampleOrders);
    }, 1500);
  }, [selectedToken, selectedTokenDetails, selectedTokenPrice, config.tradeAmount]);
  
  // Stop bot
  const stopBot = useCallback(() => {
    setIsLoading(true);
    
    // Simulate bot stopping process
    setTimeout(() => {
      setBotStatus('idle');
      setConfig(prev => ({ ...prev, isActive: false }));
      setIsLoading(false);
    }, 1000);
  }, []);
  
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
    selectedTokenDetails
  };
}
