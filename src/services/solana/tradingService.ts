
import { toast } from 'sonner';
import { priceService } from './priceService';
import { MOCK_PRICES } from './config';

export interface StopLossParams {
  tokenAddress: string;
  triggerPrice: number;
  amount: number;
  walletAddress?: string;
}

export interface TakeProfitParams {
  tokenAddress: string;
  targetPrice: number;
  amount: number;
  walletAddress?: string;
}

export interface OrderParams {
  tokenAddress: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell' | 'limit';
  walletAddress?: string;
}

// Απλοποιημένη έκδοση υπηρεσίας trading για demo
class TradingService {
  private orders: Array<{
    id: string;
    tokenAddress: string;
    price: number;
    amount: number;
    type: 'buy' | 'sell' | 'stop_loss' | 'take_profit';
    status: 'active' | 'filled' | 'cancelled';
    created: string;
    walletAddress?: string;
  }> = [];
  
  private priceCheckInterval: number | null = null;
  
  constructor() {
    // Έναρξη ελέγχου τιμών
    this.startPriceChecking();
  }

  // Ορισμός stop loss
  async setStopLoss(params: StopLossParams): Promise<string | null> {
    try {
      console.log(`Setting stop loss for ${params.tokenAddress} at ${params.triggerPrice}`);
      
      const orderId = `sl-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      this.orders.push({
        id: orderId,
        tokenAddress: params.tokenAddress,
        price: params.triggerPrice,
        amount: params.amount,
        type: 'stop_loss',
        status: 'active',
        created: new Date().toISOString(),
        walletAddress: params.walletAddress
      });
      
      toast.success('Stop loss ορίστηκε επιτυχώς');
      return orderId;
    } catch (error) {
      console.error('Error setting stop loss:', error);
      toast.error('Αποτυχία ορισμού stop loss');
      return null;
    }
  }

  // Ορισμός take profit
  async setTakeProfit(params: TakeProfitParams): Promise<string | null> {
    try {
      console.log(`Setting take profit for ${params.tokenAddress} at ${params.targetPrice}`);
      
      const orderId = `tp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      this.orders.push({
        id: orderId,
        tokenAddress: params.tokenAddress,
        price: params.targetPrice,
        amount: params.amount,
        type: 'take_profit',
        status: 'active',
        created: new Date().toISOString(),
        walletAddress: params.walletAddress
      });
      
      toast.success('Take profit ορίστηκε επιτυχώς');
      return orderId;
    } catch (error) {
      console.error('Error setting take profit:', error);
      toast.error('Αποτυχία ορισμού take profit');
      return null;
    }
  }

  // Δημιουργία εντολής αγοράς/πώλησης
  async createOrder(params: OrderParams): Promise<string | null> {
    try {
      console.log(`Creating ${params.type} order for ${params.tokenAddress} at ${params.price}`);
      
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      this.orders.push({
        id: orderId,
        tokenAddress: params.tokenAddress,
        price: params.price,
        amount: params.amount,
        type: params.type === 'limit' ? 'sell' : params.type,
        status: 'active',
        created: new Date().toISOString(),
        walletAddress: params.walletAddress
      });
      
      toast.success(`${params.type === 'buy' ? 'Αγορά' : 'Πώληση'} δημιουργήθηκε επιτυχώς`);
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Αποτυχία δημιουργίας εντολής');
      return null;
    }
  }

  // Ακύρωση εντολής
  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const orderIndex = this.orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        this.orders[orderIndex].status = 'cancelled';
        toast.success('Η εντολή ακυρώθηκε επιτυχώς');
        return true;
      }
      
      toast.error('Η εντολή δεν βρέθηκε');
      return false;
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Αποτυχία ακύρωσης εντολής');
      return false;
    }
  }

  // Λήψη ενεργών εντολών
  getActiveOrders(): Array<any> {
    return this.orders.filter(order => order.status === 'active');
  }

  // Έλεγχος τιμών για εκτέλεση stop loss/take profit
  private startPriceChecking(): void {
    if (!this.priceCheckInterval) {
      this.priceCheckInterval = window.setInterval(() => this.checkOrdersForExecution(), 10000);
    }
  }

  // Διακοπή ελέγχου τιμών
  private stopPriceChecking(): void {
    if (this.priceCheckInterval) {
      clearInterval(this.priceCheckInterval);
      this.priceCheckInterval = null;
    }
  }

  // Έλεγχος εντολών για εκτέλεση
  private async checkOrdersForExecution(): Promise<void> {
    const activeOrders = this.orders.filter(order => order.status === 'active');
    
    for (const order of activeOrders) {
      try {
        const currentPrice = await priceService.getTokenPrice(order.tokenAddress);
        
        // Έλεγχος stop loss
        if (order.type === 'stop_loss' && currentPrice.price <= order.price) {
          console.log(`Executing stop loss for ${order.tokenAddress} at ${currentPrice.price}`);
          order.status = 'filled';
          toast.info(`Stop loss εκτελέστηκε για ${order.tokenAddress} στην τιμή $${currentPrice.price.toFixed(4)}`);
        }
        
        // Έλεγχος take profit
        else if (order.type === 'take_profit' && currentPrice.price >= order.price) {
          console.log(`Executing take profit for ${order.tokenAddress} at ${currentPrice.price}`);
          order.status = 'filled';
          toast.success(`Take profit εκτελέστηκε για ${order.tokenAddress} στην τιμή $${currentPrice.price.toFixed(4)}`);
        }
      } catch (error) {
        console.error('Error checking order execution:', error);
      }
    }
  }
}

export const tradingService = new TradingService();
