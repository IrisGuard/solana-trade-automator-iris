
import { useState, useEffect, useCallback } from 'react';

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
  
  const [botStatus, setBotStatus] = useState<'idle' | 'running' | 'paused' | 'error'>('idle');
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
      setSelectedTokenPrice(token.price || 0);
    }
    return Promise.resolve();
  }, [tokens]);
  
  // Start bot
  const startBot = useCallback(() => {
    if (!selectedToken) return false;
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setBotStatus('running');
      updateConfig({ isActive: true });
      setIsLoading(false);
    }, 1500);
    
    return true;
  }, [selectedToken, updateConfig]);
  
  // Pause bot
  const pauseBot = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setBotStatus('paused');
      setIsLoading(false);
    }, 1000);
    
    return true;
  }, []);
  
  // Stop bot
  const stopBot = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setBotStatus('idle');
      updateConfig({ isActive: false });
      setIsLoading(false);
    }, 1000);
    
    return true;
  }, [updateConfig]);
  
  // Initialize with first token if available
  useEffect(() => {
    if (!selectedToken && tokens.length > 0) {
      selectToken(tokens[0].address);
    }
  }, [tokens, selectedToken, selectToken]);
  
  return {
    config,
    updateConfig,
    botStatus,
    selectedToken,
    selectedTokenPrice,
    selectedTokenDetails,
    activeOrders,
    isLoading,
    selectToken,
    startBot,
    pauseBot,
    stopBot
  };
}
