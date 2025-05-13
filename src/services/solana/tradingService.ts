
import { toast } from 'sonner';
import { getTokenPrice } from './priceService';

// Types for stop loss and take profit parameters
export interface StopLossParams {
  tokenAddress: string;
  triggerPrice: number;
  amount: number;
  walletAddress: string;
}

export interface TakeProfitParams {
  tokenAddress: string;
  targetPrice: number;
  amount: number;
  walletAddress: string;
}

export interface OrderParams {
  tokenAddress: string;
  price: number;
  amount: number;
  walletAddress: string;
  orderType: 'buy' | 'sell';
}

// Mock active orders for demonstration
const activeOrders: Array<{
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  price: number;
  amount: number;
  walletAddress: string;
  type: 'stop-loss' | 'take-profit' | 'limit-buy' | 'limit-sell';
  createdAt: Date;
}> = [];

// Generate a random ID for orders
function generateOrderId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Set a stop loss order
export async function setStopLoss(params: StopLossParams): Promise<string | null> {
  try {
    // In a real app, this would interact with a DEX or trading API
    console.log('Setting stop loss:', params);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get token details (symbol) for better UX
    const tokenPrice = await getTokenPrice(params.tokenAddress);
    const tokenSymbol = params.tokenAddress.substring(0, 4) + '...';
    
    // Create a new stop loss order
    const orderId = generateOrderId();
    activeOrders.push({
      id: orderId,
      tokenAddress: params.tokenAddress,
      tokenSymbol,
      price: params.triggerPrice,
      amount: params.amount,
      walletAddress: params.walletAddress,
      type: 'stop-loss',
      createdAt: new Date()
    });
    
    toast.success(`Δημιουργήθηκε stop-loss στα $${params.triggerPrice.toFixed(4)}`);
    return orderId;
  } catch (error) {
    console.error('Error setting stop loss:', error);
    toast.error('Αποτυχία δημιουργίας stop-loss');
    return null;
  }
}

// Set a take profit order
export async function setTakeProfit(params: TakeProfitParams): Promise<string | null> {
  try {
    // In a real app, this would interact with a DEX or trading API
    console.log('Setting take profit:', params);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get token details (symbol) for better UX
    const tokenSymbol = params.tokenAddress.substring(0, 4) + '...';
    
    // Create a new take profit order
    const orderId = generateOrderId();
    activeOrders.push({
      id: orderId,
      tokenAddress: params.tokenAddress,
      tokenSymbol,
      price: params.targetPrice,
      amount: params.amount,
      walletAddress: params.walletAddress,
      type: 'take-profit',
      createdAt: new Date()
    });
    
    toast.success(`Δημιουργήθηκε take-profit στα $${params.targetPrice.toFixed(4)}`);
    return orderId;
  } catch (error) {
    console.error('Error setting take profit:', error);
    toast.error('Αποτυχία δημιουργίας take-profit');
    return null;
  }
}

// Place a limit order (buy or sell)
export async function placeLimitOrder(params: OrderParams): Promise<string | null> {
  try {
    // In a real app, this would interact with a DEX or trading API
    console.log('Placing limit order:', params);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get token details (symbol) for better UX
    const tokenSymbol = params.tokenAddress.substring(0, 4) + '...';
    
    // Create a new limit order
    const orderId = generateOrderId();
    activeOrders.push({
      id: orderId,
      tokenAddress: params.tokenAddress,
      tokenSymbol,
      price: params.price,
      amount: params.amount,
      walletAddress: params.walletAddress,
      type: params.orderType === 'buy' ? 'limit-buy' : 'limit-sell',
      createdAt: new Date()
    });
    
    toast.success(`Δημιουργήθηκε εντολή ${params.orderType === 'buy' ? 'αγοράς' : 'πώλησης'} στα $${params.price.toFixed(4)}`);
    return orderId;
  } catch (error) {
    console.error('Error placing limit order:', error);
    toast.error('Αποτυχία δημιουργίας εντολής');
    return null;
  }
}

// Cancel an order
export async function cancelOrder(orderId: string): Promise<boolean> {
  try {
    // In a real app, this would interact with a DEX or trading API
    console.log('Cancelling order:', orderId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the order index
    const orderIndex = activeOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      // Remove the order from the active orders
      activeOrders.splice(orderIndex, 1);
      toast.success('Η εντολή ακυρώθηκε επιτυχώς');
      return true;
    } else {
      toast.error('Η εντολή δεν βρέθηκε');
      return false;
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    toast.error('Αποτυχία ακύρωσης εντολής');
    return false;
  }
}

// Get all active orders
export function getActiveOrders(): Array<any> {
  return [...activeOrders];
}

// Export services
export const tradingService = {
  setStopLoss,
  setTakeProfit,
  placeLimitOrder,
  cancelOrder,
  getActiveOrders
};
