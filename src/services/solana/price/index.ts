
import { TokenPrice } from './types';

export function getMockTokenPrice(tokenAddress: string): TokenPrice {
  return {
    price: Math.random() * 100,
    change24h: (Math.random() - 0.5) * 20,
    priceChange24h: (Math.random() - 0.5) * 20,
    volume24h: Math.random() * 1000000,
    marketCap: Math.random() * 10000000,
    lastUpdated: new Date()
  };
}

export { TokenPrice, TokenPrices } from './types';
