
import { toast } from 'sonner';
import { TokenPriceData } from './types';
import { MOCK_PRICE_DATA, getVolatilePrice } from './mockData';

// Get price for a specific token
export async function getTokenPrice(tokenAddress: string): Promise<TokenPriceData> {
  try {
    // In a real app, this would call an external price API
    const mockPrice = MOCK_PRICE_DATA[tokenAddress];
    
    if (mockPrice) {
      // Add some volatility to price for demo purposes
      return {
        ...mockPrice,
        price: getVolatilePrice(mockPrice.price),
        lastUpdated: new Date()
      };
    }
    
    // For tokens we don't have data for, generate a random price
    return {
      price: Math.random() * 10 + 0.01, // Random price between 0.01 and 10.01
      priceChange24h: Math.random() * 10 - 5, // Random change between -5% and +5%
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error fetching token price:', error);
    toast.error('Αποτυχία λήψης τιμής token');
    
    // Return a fallback price on error
    return {
      price: 0,
      priceChange24h: 0,
      lastUpdated: new Date()
    };
  }
}

// Fetch prices for multiple tokens
export async function fetchTokenPrices(tokenAddresses: string[]): Promise<Record<string, TokenPriceData>> {
  try {
    const prices: Record<string, TokenPriceData> = {};
    
    for (const address of tokenAddresses) {
      prices[address] = await getTokenPrice(address);
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
}
