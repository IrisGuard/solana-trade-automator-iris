
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { tradingService, StopLossParams, TakeProfitParams, OrderParams } from '@/services/solana/tradingService';
import { priceService, TokenPriceData } from '@/services/solana/price';
import { useSolanaWallet } from './useSolanaWallet';
import { Token } from '@/types/wallet';

export interface TradingBotConfig {
  isActive: boolean;
  selectedToken: string | null;
  stopLossPercent: number;
  takeProfitPercent: number;
  tradeAmount: number;
  maxTrades: number;
}

export function useTradingBot(initialConfig?: Partial<TradingBotConfig>) {
  const { walletAddress, connected, publicKey, tokens } = useSolanaWallet();
  
  // Bot configuration
  const [config, setConfig] = useState<TradingBotConfig>({
    isActive: false,
    selectedToken: null,
    stopLossPercent: 5, // 5% below entry price
    takeProfitPercent: 10, // 10% above entry price
    tradeAmount: 0.1, // Amount to trade in SOL
    maxTrades: 3,
    ...initialConfig
  });
  
  // Trading state
  const [isLoading, setIsLoading] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Array<any>>([]);
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<TokenPriceData | null>(null);
  const [tradeHistory, setTradeHistory] = useState<Array<any>>([]);
  const [botStatus, setBotStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  
  // Load active orders
  useEffect(() => {
    if (connected) {
      const orders = tradingService.getActiveOrders();
      setActiveOrders(orders);
    }
  }, [connected]);
  
  // Subscribe to price updates for selected token
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    if (config.selectedToken && connected) {
      // Initial price fetch
      priceService.getTokenPrice(config.selectedToken)
        .then(price => setSelectedTokenPrice(price))
        .catch(err => console.error('Error fetching initial price:', err));
      
      // Set up subscription
      unsubscribe = priceService.subscribeToPriceUpdates(
        config.selectedToken,
        (price) => setSelectedTokenPrice(price)
      );
    }
    
    // Cleanup subscription
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [config.selectedToken, connected]);
  
  // Start the trading bot
  const startBot = useCallback(async () => {
    if (!connected || !config.selectedToken || !walletAddress) {
      toast.error('Συνδέστε το πορτοφόλι σας πρώτα');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Get current price as entry price
      const currentPrice = await priceService.getTokenPrice(config.selectedToken);
      
      // Calculate stop loss and take profit prices
      const stopLossPrice = currentPrice.price * (1 - (config.stopLossPercent / 100));
      const takeProfitPrice = currentPrice.price * (1 + (config.takeProfitPercent / 100));
      
      // Set stop loss
      const stopLossId = await tradingService.setStopLoss({
        tokenAddress: config.selectedToken,
        triggerPrice: stopLossPrice,
        amount: config.tradeAmount,
        walletAddress
      });
      
      // Set take profit
      const takeProfitId = await tradingService.setTakeProfit({
        tokenAddress: config.selectedToken,
        targetPrice: takeProfitPrice,
        amount: config.tradeAmount,
        walletAddress
      });
      
      // Update bot status
      if (stopLossId && takeProfitId) {
        setBotStatus('running');
        setConfig(prev => ({...prev, isActive: true}));
        
        // Get updated orders list
        const orders = tradingService.getActiveOrders();
        setActiveOrders(orders);
        
        toast.success('Το trading bot ξεκίνησε με επιτυχία');
        return true;
      }
      
      throw new Error('Failed to set up orders');
    } catch (error) {
      console.error('Error starting trading bot:', error);
      toast.error('Αποτυχία εκκίνησης trading bot');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [config, connected, walletAddress]);
  
  // Stop the trading bot
  const stopBot = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get all active orders
      const orders = tradingService.getActiveOrders();
      
      // Cancel all orders
      for (const order of orders) {
        await tradingService.cancelOrder(order.id);
      }
      
      // Update bot status
      setBotStatus('idle');
      setConfig(prev => ({...prev, isActive: false}));
      setActiveOrders([]);
      
      toast.success('Το trading bot σταμάτησε');
      return true;
    } catch (error) {
      console.error('Error stopping trading bot:', error);
      toast.error('Αποτυχία διακοπής trading bot');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update bot configuration
  const updateConfig = useCallback((newConfig: Partial<TradingBotConfig>) => {
    setConfig(prev => ({...prev, ...newConfig}));
  }, []);
  
  // Select a token for trading
  const selectToken = useCallback((tokenAddress: string | null) => {
    setConfig(prev => ({...prev, selectedToken: tokenAddress}));
    
    if (tokenAddress) {
      priceService.getTokenPrice(tokenAddress)
        .then(price => setSelectedTokenPrice(price))
        .catch(err => console.error('Error fetching token price:', err));
    } else {
      setSelectedTokenPrice(null);
    }
  }, []);
  
  // Find selected token details
  const selectedTokenDetails = tokens.find(token => token.address === config.selectedToken);
  
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
    tradeHistory,
    connected,
    tokens
  };
}
