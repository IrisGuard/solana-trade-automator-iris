
import { useState, useCallback } from 'react';
import { useErrorReporting } from '../useErrorReporting';
import { TradingBotConfig, TradingOrder, ActiveOrder, TokenPriceInfo } from './types';

interface BotActionsProps {
  config: TradingBotConfig;
}

export function useBotActions({ config }: BotActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const { reportError } = useErrorReporting();
  
  // Place a buy order
  const placeBuyOrder = useCallback(async (price: number, amount: number) => {
    try {
      setIsProcessing(true);
      
      // In a real app, this would call the API to place an order
      console.log(`Placing buy order: ${amount} of ${config.selectedToken} at $${price}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderId = `order-${Date.now()}`;
      setLastOrderId(orderId);
      
      return orderId;
    } catch (error) {
      reportError(error as Error, {
        component: 'BotActions',
        source: 'trading',
        details: { action: 'buy', price, amount }
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [config.selectedToken, reportError]);
  
  // Place a sell order
  const placeSellOrder = useCallback(async (price: number, amount: number) => {
    try {
      setIsProcessing(true);
      
      // In a real app, this would call the API to place an order
      console.log(`Placing sell order: ${amount} of ${config.selectedToken} at $${price}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderId = `order-${Date.now()}`;
      setLastOrderId(orderId);
      
      return orderId;
    } catch (error) {
      reportError(error as Error, {
        component: 'BotActions',
        source: 'trading',
        details: { action: 'sell', price, amount }
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [config.selectedToken, reportError]);
  
  // Calculate order size based on current balance and configuration
  const calculateOrderSize = useCallback((currentBalance: number, currentPrice: number) => {
    if (!currentPrice || currentPrice <= 0) return 0;
    
    // Use either a percentage of the balance or a fixed trade amount
    let orderSize;
    
    // If using percentage-based sizing 
    if (config.enabledStrategies.dca) {
      // Dollar-cost averaging
      orderSize = (currentBalance * 0.1) / currentPrice; // 10% of balance
    } else if (config.tradeAmount) {
      // Fixed amount
      orderSize = config.tradeAmount / currentPrice;
    } else {
      // Default fallback
      orderSize = (currentBalance * 0.05) / currentPrice; // 5% of balance
    }
    
    return orderSize;
  }, [config]);
  
  return {
    placeBuyOrder,
    placeSellOrder,
    calculateOrderSize,
    isProcessing,
    lastOrderId
  };
}
