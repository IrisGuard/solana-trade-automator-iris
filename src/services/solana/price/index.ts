
import { TokenPriceData } from './types';

// Μοκ δεδομένα για τις τιμές των token
const mockPrices: Record<string, TokenPriceData> = {
  'So11111111111111111111111111111111111111112': {
    price: 142.50,
    priceChange24h: 5.3,
    volume24h: 1500000000,
    marketCap: 65000000000,
    lastUpdated: new Date()
  },
  '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E': {
    price: 65450.75,
    priceChange24h: -2.1,
    volume24h: 25000000000,
    marketCap: 1250000000000,
    lastUpdated: new Date()
  },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    price: 1.00,
    priceChange24h: 0.01,
    volume24h: 3500000000,
    marketCap: 32000000000,
    lastUpdated: new Date()
  }
};

export const fetchTokenPrices = async (tokenAddress: string): Promise<TokenPriceData | null> => {
  console.log(`Fetching price for token ${tokenAddress}`);
  
  // Προσομοίωση API κλήσης
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPrices[tokenAddress] || null);
    }, 500);
  });
};

export const fetchTokenPricesBatch = async (tokenAddresses: string[]): Promise<Record<string, TokenPriceData>> => {
  console.log(`Fetching prices for multiple tokens: ${tokenAddresses.join(', ')}`);
  
  // Προσομοίωση API κλήσης
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: Record<string, TokenPriceData> = {};
      
      tokenAddresses.forEach(address => {
        if (mockPrices[address]) {
          results[address] = mockPrices[address];
        }
      });
      
      resolve(results);
    }, 1000);
  });
};
