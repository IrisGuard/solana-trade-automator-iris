
import { TokenPrice } from './types';

export async function fetchTokenPrice(tokenAddress: string): Promise<TokenPrice> {
  try {
    // Mock price data for now
    const price = Math.random() * 100 + 10;
    const change24h = (Math.random() - 0.5) * 20;
    
    return {
      price,
      change24h,
      priceChange24h: change24h,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error fetching token price:', error);
    return {
      price: 0,
      change24h: 0,
      priceChange24h: 0,
      lastUpdated: new Date()
    };
  }
}
