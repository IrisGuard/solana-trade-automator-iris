
import { useState, useEffect, useCallback } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { useErrorReporting } from './useErrorReporting';
import { Token } from '@/types/wallet';
import { BotStatus, TradingBotConfig, TradingOrder } from './trading-bot/types';
import { toast } from 'sonner';
import { sendToken } from '@/services/solana/wallet/transfer';
import { jupiterService } from '@/services/solana/jupiterService';
import { priceService } from '@/services/solana/priceService';
import { botTransactionService } from '@/services/bot/botTransactionService';
import { usePriceSubscription } from './trading-bot/usePriceSubscription';

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
  const { walletAddress, tokens, isConnected, refreshWalletData } = useWalletConnection();
  const [config, setConfig] = useState<TradingBotConfig>(defaultConfig);
  const [botStatus, setBotStatus] = useState<BotStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [activeOrders, setActiveOrders] = useState<TradingOrder[]>([]);
  const [botId, setBotId] = useState<string>(`bot-${Date.now()}`);
  const { reportError } = useErrorReporting();
  
  // Get selected token details
  const selectedTokenDetails = tokens.find(token => token.address === config.selectedToken);
  
  // Use price subscription hook for real-time price updates
  const tokenAddress = config.selectedToken || null;
  const priceSubscription = usePriceSubscription(tokenAddress);
  const selectedTokenPrice = priceSubscription.priceInfo;

  // Cleanup bot on unmount
  useEffect(() => {
    return () => {
      if (botStatus === 'running') {
        console.log('Cleaning up bot resources...');
        // Cancel any pending orders
        setActiveOrders([]);
        setBotStatus('idle');
      }
    };
  }, [botStatus]);

  // Update config
  const updateConfig = (newConfig: Partial<TradingBotConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  };

  // Select token
  const selectToken = async (tokenAddress: string | null) => {
    try {
      if (tokenAddress) {
        setIsLoading(true);
        // Fetch latest price data for the token
        if (tokenAddress) {
          const priceData = await priceService.getTokenPrice(tokenAddress);
          if (priceData) {
            // Price data is now handled by the usePriceSubscription hook
            console.log('Token price loaded:', priceData);
          }
        }
        
        updateConfig({ selectedToken: tokenAddress });
      } else {
        updateConfig({ selectedToken: null });
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

  // Create a buy order
  const createBuyOrder = async (amount: number, price: number): Promise<string | null> => {
    if (!walletAddress || !config.selectedToken) return null;
    
    try {
      setIsLoading(true);
      
      // In a real application, this would interact with an exchange API
      // For demonstration, we'll simulate a swap from SOL to the selected token
      const solTokenAddress = 'So11111111111111111111111111111111111111112';
      
      // Record the order
      const orderId = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const newOrder: TradingOrder = {
        id: orderId,
        type: 'buy',
        price: price,
        amount: amount,
        token: config.selectedToken,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setActiveOrders(prevOrders => [...prevOrders, newOrder]);
      
      // Execute the swap
      const success = await jupiterService.swapTokens(
        solTokenAddress,
        config.selectedToken,
        amount,
        walletAddress
      );
      
      if (success) {
        // Update order status
        setActiveOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'completed' } 
              : order
          )
        );
        
        // Record transaction in database
        await botTransactionService.recordBotTransaction({
          bot_id: botId,
          transaction_type: 'buy',
          amount: amount,
          token_symbol: selectedTokenDetails?.symbol || 'Unknown',
          price: price,
          status: 'completed'
        });
        
        // Refresh wallet after transaction
        await refreshWalletData();
        
        return orderId;
      } else {
        // Update order status to failed
        setActiveOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'failed' } 
              : order
          )
        );
        
        return null;
      }
    } catch (error) {
      console.error('Error creating buy order:', error);
      reportError(error instanceof Error ? error : new Error('Error creating buy order'), {
        component: 'TradingBot',
        source: 'client'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a sell order
  const createSellOrder = async (amount: number, price: number): Promise<string | null> => {
    if (!walletAddress || !config.selectedToken) return null;
    
    try {
      setIsLoading(true);
      
      // In a real application, this would interact with an exchange API
      // For demonstration, we'll simulate a swap from the selected token to SOL
      const solTokenAddress = 'So11111111111111111111111111111111111111112';
      
      // Record the order
      const orderId = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const newOrder: TradingOrder = {
        id: orderId,
        type: 'sell',
        price: price,
        amount: amount,
        token: config.selectedToken,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setActiveOrders(prevOrders => [...prevOrders, newOrder]);
      
      // Execute the swap
      const success = await jupiterService.swapTokens(
        config.selectedToken,
        solTokenAddress,
        amount,
        walletAddress
      );
      
      if (success) {
        // Update order status
        setActiveOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'completed' } 
              : order
          )
        );
        
        // Record transaction in database
        await botTransactionService.recordBotTransaction({
          bot_id: botId,
          transaction_type: 'sell',
          amount: amount,
          token_symbol: selectedTokenDetails?.symbol || 'Unknown',
          price: price,
          status: 'completed'
        });
        
        // Refresh wallet after transaction
        await refreshWalletData();
        
        return orderId;
      } else {
        // Update order status to failed
        setActiveOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'failed' } 
              : order
          )
        );
        
        return null;
      }
    } catch (error) {
      console.error('Error creating sell order:', error);
      reportError(error instanceof Error ? error : new Error('Error creating sell order'), {
        component: 'TradingBot',
        source: 'client'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Execute bot strategy
  const executeStrategy = async () => {
    if (!config.selectedToken || !selectedTokenPrice || !walletAddress) {
      return;
    }
    
    try {
      const currentPrice = selectedTokenPrice.price;
      
      // Implement simple strategy
      if (config.strategy === 'simple') {
        // Check if price has dropped below buy threshold
        if (selectedTokenPrice.change24h < -config.buyThreshold) {
          console.log('Buy signal triggered:', selectedTokenPrice.change24h, 'threshold:', -config.buyThreshold);
          await createBuyOrder(config.tradeAmount, currentPrice);
          toast.info('Buy signal triggered', {
            description: `Price dropped ${selectedTokenPrice.change24h.toFixed(2)}%, buying ${config.tradeAmount} tokens`
          });
        }
        
        // Check if price has risen above sell threshold
        if (selectedTokenPrice.change24h > config.sellThreshold) {
          console.log('Sell signal triggered:', selectedTokenPrice.change24h, 'threshold:', config.sellThreshold);
          await createSellOrder(config.tradeAmount, currentPrice);
          toast.info('Sell signal triggered', {
            description: `Price rose ${selectedTokenPrice.change24h.toFixed(2)}%, selling ${config.tradeAmount} tokens`
          });
        }
      }
      
      // Implement DCA strategy
      if (config.strategy === 'dca' && config.enabledStrategies.dca) {
        // DCA buys at regular intervals regardless of price
        // This would typically be implemented with a schedule
        console.log('DCA strategy - would execute buy at scheduled time');
      }
      
      // Handle stop loss and take profit
      if (activeOrders.some(order => order.type === 'buy' && order.status === 'completed')) {
        // Get average buy price
        const buyOrders = activeOrders.filter(order => order.type === 'buy' && order.status === 'completed');
        if (buyOrders.length > 0) {
          const avgBuyPrice = buyOrders.reduce((sum, order) => sum + order.price, 0) / buyOrders.length;
          
          // Check stop loss
          if (currentPrice < avgBuyPrice * (1 - config.stopLoss / 100)) {
            console.log('Stop loss triggered:', currentPrice, 'avg buy:', avgBuyPrice, 'stop loss:', config.stopLoss);
            await createSellOrder(config.tradeAmount, currentPrice);
            toast.warning('Stop loss triggered', {
              description: `Price fell below stop loss threshold, selling ${config.tradeAmount} tokens`
            });
          }
          
          // Check take profit
          if (currentPrice > avgBuyPrice * (1 + config.takeProfit / 100)) {
            console.log('Take profit triggered:', currentPrice, 'avg buy:', avgBuyPrice, 'take profit:', config.takeProfit);
            await createSellOrder(config.tradeAmount, currentPrice);
            toast.success('Take profit triggered', {
              description: `Price rose above take profit threshold, selling ${config.tradeAmount} tokens`
            });
          }
        }
      }
    } catch (error) {
      console.error('Error executing trading strategy:', error);
      reportError(error instanceof Error ? error : new Error('Error executing trading strategy'), {
        component: 'TradingBot',
        source: 'client'
      });
    }
  };

  // Start bot
  const startBot = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!config.selectedToken) {
        toast.error('Παρακαλώ επιλέξτε ένα token');
        return;
      }
      
      // Generate unique bot ID
      const newBotId = `bot-${Date.now()}`;
      setBotId(newBotId);
      
      // Create initial orders based on strategy
      if (config.strategy === 'simple') {
        // Simple strategy - create initial buy order
        const initialBuyAmount = config.tradeAmount * 0.5; // Start with half the configured amount
        
        if (selectedTokenPrice && selectedTokenPrice.price) {
          await createBuyOrder(initialBuyAmount, selectedTokenPrice.price);
          
          toast.success('Trading bot started', {
            description: `Initial buy order placed for ${initialBuyAmount} ${selectedTokenDetails?.symbol || 'tokens'}`
          });
        }
      }
      
      // Set up interval to execute strategy
      const intervalId = setInterval(() => {
        if (botStatus === 'running') {
          executeStrategy();
        }
      }, 60000); // Check every minute
      
      // Store interval ID for cleanup
      (window as any).tradingBotInterval = intervalId;
      
      setBotStatus('running');
    } catch (error) {
      reportError(error instanceof Error ? error : new Error('Unknown error starting bot'), { 
        component: 'TradingBot', 
        source: 'client' 
      });
      toast.error('Error starting trading bot');
    } finally {
      setIsLoading(false);
    }
  }, [config, selectedTokenPrice, selectedTokenDetails, walletAddress]);

  // Stop bot
  const stopBot = useCallback(() => {
    try {
      setIsLoading(true);
      
      // Clear interval
      if ((window as any).tradingBotInterval) {
        clearInterval((window as any).tradingBotInterval);
        delete (window as any).tradingBotInterval;
      }
      
      // Cancel any pending orders 
      // In a real implementation, this would cancel orders with the exchange
      setActiveOrders(prevOrders => 
        prevOrders.map(order => 
          order.status === 'pending' 
            ? { ...order, status: 'cancelled' } 
            : order
        )
      );
      
      setBotStatus('idle');
      toast.info('Trading bot stopped');
    } catch (error) {
      reportError(error instanceof Error ? error : new Error('Unknown error stopping bot'), { 
        component: 'TradingBot', 
        source: 'client' 
      });
      toast.error('Error stopping trading bot');
    } finally {
      setIsLoading(false);
    }
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
    selectedTokenDetails,
    tokens,
    connected: isConnected,
    executeStrategy
  };
}
