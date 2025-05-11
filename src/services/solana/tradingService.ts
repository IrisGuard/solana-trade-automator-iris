
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { priceService } from './priceService';
import { connection } from './config';

// Interfaces for order types
export interface OrderParams {
  tokenAddress: string;
  amount: number;
  walletAddress: string;
}

export interface StopLossParams extends OrderParams {
  triggerPrice: number;
}

export interface TakeProfitParams extends OrderParams {
  targetPrice: number;
}

// Map to store active orders
const activeOrders: Record<string, {
  id: string;
  type: 'stop-loss' | 'take-profit';
  tokenAddress: string;
  price: number;
  amount: number;
  walletAddress: string;
  intervalId: number;
}> = {};

export const tradingService = {
  /**
   * Create a buy order for a token
   */
  createBuyOrder: async (params: OrderParams): Promise<string | null> => {
    try {
      // In a real implementation, this would interact with a DEX like Jupiter API
      // For now, we'll just simulate a successful transaction
      
      toast.loading('Δημιουργία εντολής αγοράς...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = `buy-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      toast.success(`Επιτυχής δημιουργία εντολής αγοράς ${params.amount} tokens`);
      return orderId;
    } catch (error) {
      console.error('Error creating buy order:', error);
      toast.error('Αποτυχία δημιουργίας εντολής αγοράς');
      return null;
    } finally {
      toast.dismiss();
    }
  },
  
  /**
   * Create a sell order for a token
   */
  createSellOrder: async (params: OrderParams): Promise<string | null> => {
    try {
      // In a real implementation, this would interact with a DEX like Jupiter API
      // For now, we'll just simulate a successful transaction
      
      toast.loading('Δημιουργία εντολής πώλησης...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = `sell-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      toast.success(`Επιτυχής δημιουργία εντολής πώλησης ${params.amount} tokens`);
      return orderId;
    } catch (error) {
      console.error('Error creating sell order:', error);
      toast.error('Αποτυχία δημιουργίας εντολής πώλησης');
      return null;
    } finally {
      toast.dismiss();
    }
  },
  
  /**
   * Set a stop-loss order for a token
   * This will monitor the price and sell when it drops below the trigger price
   */
  setStopLoss: async (params: StopLossParams): Promise<string | null> => {
    try {
      const { tokenAddress, triggerPrice, amount, walletAddress } = params;
      
      // Create a unique ID for this stop-loss
      const stopLossId = `sl-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Set up price monitoring interval
      const intervalId = window.setInterval(async () => {
        try {
          // Get current price
          const priceData = await priceService.getTokenPrice(tokenAddress);
          
          // Check if price is below trigger
          if (priceData.price <= triggerPrice) {
            // Execute sell order
            await tradingService.createSellOrder({
              tokenAddress,
              amount,
              walletAddress
            });
            
            // Clean up the stop-loss
            tradingService.cancelOrder(stopLossId);
            
            toast.success(`Stop-loss ενεργοποιήθηκε στην τιμή ${priceData.price}`);
          }
        } catch (error) {
          console.error('Error monitoring stop-loss:', error);
        }
      }, 10000); // Check every 10 seconds
      
      // Store the stop-loss in our active orders
      activeOrders[stopLossId] = {
        id: stopLossId,
        type: 'stop-loss',
        tokenAddress,
        price: triggerPrice,
        amount,
        walletAddress,
        intervalId
      };
      
      toast.success(`Stop-loss ορίστηκε στην τιμή ${triggerPrice}`);
      return stopLossId;
    } catch (error) {
      console.error('Error setting stop-loss:', error);
      toast.error('Αποτυχία ορισμού stop-loss');
      return null;
    }
  },
  
  /**
   * Set a take-profit order for a token
   * This will monitor the price and sell when it reaches the target price
   */
  setTakeProfit: async (params: TakeProfitParams): Promise<string | null> => {
    try {
      const { tokenAddress, targetPrice, amount, walletAddress } = params;
      
      // Create a unique ID for this take-profit
      const takeProfitId = `tp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Set up price monitoring interval
      const intervalId = window.setInterval(async () => {
        try {
          // Get current price
          const priceData = await priceService.getTokenPrice(tokenAddress);
          
          // Check if price is above target
          if (priceData.price >= targetPrice) {
            // Execute sell order
            await tradingService.createSellOrder({
              tokenAddress,
              amount,
              walletAddress
            });
            
            // Clean up the take-profit
            tradingService.cancelOrder(takeProfitId);
            
            toast.success(`Take-profit ενεργοποιήθηκε στην τιμή ${priceData.price}`);
          }
        } catch (error) {
          console.error('Error monitoring take-profit:', error);
        }
      }, 10000); // Check every 10 seconds
      
      // Store the take-profit in our active orders
      activeOrders[takeProfitId] = {
        id: takeProfitId,
        type: 'take-profit',
        tokenAddress,
        price: targetPrice,
        amount,
        walletAddress,
        intervalId
      };
      
      toast.success(`Take-profit ορίστηκε στην τιμή ${targetPrice}`);
      return takeProfitId;
    } catch (error) {
      console.error('Error setting take-profit:', error);
      toast.error('Αποτυχία ορισμού take-profit');
      return null;
    }
  },
  
  /**
   * Cancel an active order (stop-loss or take-profit)
   */
  cancelOrder: (orderId: string): boolean => {
    try {
      const order = activeOrders[orderId];
      
      if (!order) {
        console.error(`Order ${orderId} not found`);
        return false;
      }
      
      // Clear the interval
      clearInterval(order.intervalId);
      
      // Remove from active orders
      delete activeOrders[orderId];
      
      toast.success(`Η εντολή ακυρώθηκε με επιτυχία`);
      return true;
    } catch (error) {
      console.error('Error canceling order:', error);
      toast.error('Αποτυχία ακύρωσης εντολής');
      return false;
    }
  },
  
  /**
   * Get all active orders
   */
  getActiveOrders: (): Array<{
    id: string;
    type: 'stop-loss' | 'take-profit';
    tokenAddress: string;
    price: number;
    amount: number;
  }> => {
    return Object.values(activeOrders).map(order => ({
      id: order.id,
      type: order.type,
      tokenAddress: order.tokenAddress,
      price: order.price,
      amount: order.amount
    }));
  }
};
