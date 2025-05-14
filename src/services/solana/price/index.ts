
import { TokenPriceData } from './types';
import { fetchTokenPrices } from './fetchPrice';

// For backward compatibility
export const fetchTokenPrice = async (tokenAddress: string): Promise<TokenPriceData> => {
  const prices = await fetchTokenPrices([tokenAddress]);
  if (prices && prices[tokenAddress]) {
    return prices[tokenAddress];
  }
  
  // Return default data if not found
  return {
    price: 0,
    priceChange24h: 0,
    lastUpdated: new Date()
  };
};

// Price subscription type
export interface PriceSubscription {
  id: string;
  tokenAddress: string;
  interval: number;
  callback: (price: TokenPriceData) => void;
  timerId: number;
}

// Price service class
class PriceService {
  private subscriptions: Map<string, PriceSubscription> = new Map();
  
  /**
   * Get price for a specific token
   */
  public async getTokenPrice(tokenAddress: string): Promise<TokenPriceData> {
    return fetchTokenPrice(tokenAddress);
  }
  
  /**
   * Get prices for multiple tokens
   */
  public async getTokenPrices(tokenAddresses: string[]): Promise<Record<string, TokenPriceData>> {
    return fetchTokenPrices(tokenAddresses);
  }
  
  /**
   * Subscribe to price updates for a token
   */
  public subscribeToPriceUpdates(options: {
    tokenAddress: string;
    callback: (price: TokenPriceData) => void;
    interval?: number;
  }): string {
    const { tokenAddress, callback, interval = 60000 } = options;
    
    // Generate a subscription ID
    const subscriptionId = `${tokenAddress}-${Date.now()}`;
    
    // Set up interval to fetch price updates
    const timerId = window.setInterval(async () => {
      try {
        const price = await this.getTokenPrice(tokenAddress);
        callback(price);
      } catch (error) {
        console.error(`Error fetching price update for ${tokenAddress}:`, error);
      }
    }, interval);
    
    // Save subscription
    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      tokenAddress,
      callback,
      interval,
      timerId
    });
    
    // Initial price fetch
    this.getTokenPrice(tokenAddress)
      .then(callback)
      .catch(error => console.error(`Error fetching initial price for ${tokenAddress}:`, error));
    
    return subscriptionId;
  }
  
  /**
   * Unsubscribe from price updates
   */
  public unsubscribeFromPriceUpdates(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    
    if (!subscription) {
      return false;
    }
    
    // Clear the interval
    clearInterval(subscription.timerId);
    
    // Remove the subscription
    this.subscriptions.delete(subscriptionId);
    
    return true;
  }
}

// Create singleton instance
export const priceService = new PriceService();

// Re-export individual functions for direct usage
export { 
  fetchTokenPrices 
};

// Re-export types
export type { TokenPriceData };
