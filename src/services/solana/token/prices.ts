
import { MOCK_PRICES } from '../config';

// Fetch token prices
export const fetchTokenPrices = async (tokenAddresses: string[]): Promise<Record<string, number>> => {
  try {
    const prices: Record<string, number> = {};
    
    // In a real implementation, we would fetch actual prices from an API
    // This is just a mock implementation
    for (const address of tokenAddresses) {
      prices[address] = MOCK_PRICES[address] || Math.random() * 10;
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
};
