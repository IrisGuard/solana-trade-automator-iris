
import { MOCK_PRICES } from '../config';

// Fetch token prices
export const fetchTokenPrices = async (tokenAddress: string): Promise<{ price: number; priceChange24h: number }> => {
  try {
    // In a real implementation, we would fetch actual prices from an API
    // This is just a mock implementation
    if (tokenAddress in MOCK_PRICES) {
      return MOCK_PRICES[tokenAddress];
    } else {
      return { 
        price: Math.random() * 10, 
        priceChange24h: (Math.random() * 2) - 1 
      };
    }
  } catch (error) {
    console.error('Error fetching token price:', error);
    return {
      price: 0,
      priceChange24h: 0
    };
  }
};

export const fetchMultipleTokenPrices = async (tokenAddresses: string[]): Promise<Record<string, { price: number; priceChange24h: number }>> => {
  try {
    const prices: Record<string, { price: number; priceChange24h: number }> = {};
    
    for (const address of tokenAddresses) {
      if (address in MOCK_PRICES) {
        prices[address] = MOCK_PRICES[address];
      } else {
        prices[address] = { 
          price: Math.random() * 10, 
          priceChange24h: (Math.random() * 2) - 1 
        };
      }
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
};
