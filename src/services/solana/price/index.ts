
import { TokenPriceData } from './types';

// Mock price data for testing
const mockPriceData: Record<string, TokenPriceData> = {
  'So11111111111111111111111111111111111111112': {
    price: 85.23,
    priceChange24h: 3.5,
    volume24h: 1500000000,
    marketCap: 30000000000,
    lastUpdated: new Date()
  },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    price: 1.00,
    priceChange24h: 0.01,
    volume24h: 5000000000,
    marketCap: 25000000000,
    lastUpdated: new Date()
  },
  '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E': {
    price: 42000.00,
    priceChange24h: -1.2,
    volume24h: 30000000000,
    marketCap: 800000000000,
    lastUpdated: new Date()
  }
};

export const fetchTokenPrice = async (tokenAddress: string): Promise<TokenPriceData | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPriceData[tokenAddress] || null);
    }, 500);
  });
};

export const fetchMultipleTokenPrices = async (
  tokenAddresses: string[]
): Promise<Record<string, TokenPriceData>> => {
  // Simulate API call
  return new Promise((resolve) => {
    const result: Record<string, TokenPriceData> = {};
    
    tokenAddresses.forEach(address => {
      if (mockPriceData[address]) {
        result[address] = mockPriceData[address];
      }
    });
    
    setTimeout(() => {
      resolve(result);
    }, 800);
  });
};

// Export priceService for compatibility with existing code
export const priceService = {
  fetchTokenPrice,
  fetchMultipleTokenPrices,
  subscribeToPrice: (tokenAddress: string, callback: (price: number) => void) => {
    // Simulate price updates every 10 seconds
    const interval = setInterval(() => {
      const price = mockPriceData[tokenAddress]?.price || 0;
      const randomChange = (Math.random() * 0.1) - 0.05; // -5% to +5%
      const newPrice = price * (1 + randomChange);
      
      if (mockPriceData[tokenAddress]) {
        mockPriceData[tokenAddress].price = newPrice;
        mockPriceData[tokenAddress].lastUpdated = new Date();
      }
      
      callback(newPrice);
    }, 10000);
    
    // Return unsubscribe function
    return () => clearInterval(interval);
  }
};
