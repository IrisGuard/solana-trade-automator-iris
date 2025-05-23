
import type { TokenPrice } from '../token/types';

export const mockPriceData: Record<string, TokenPrice> = {
  'SOL': {
    price: 23.45,
    priceChange24h: 5.2,
    change24h: 5.2, // Added missing property
    volume24h: 1000000,
    marketCap: 9000000000,
    lastUpdated: new Date()
  }
};
