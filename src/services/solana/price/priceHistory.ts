
import { TokenPrice } from '../token/types';

export async function getTokenPriceHistory(
  tokenAddress: string,
  timeframe: '1h' | '24h' | '7d' | '30d' = '24h'
): Promise<TokenPrice[]> {
  // Mock implementation for now
  const basePrice = 23.45;
  const history: TokenPrice[] = [];
  
  const points = timeframe === '1h' ? 60 : timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
  
  for (let i = 0; i < points; i++) {
    const variance = (Math.random() - 0.5) * 0.1; // 10% variance
    const price = basePrice * (1 + variance);
    
    history.push({
      price,
      priceChange24h: (Math.random() - 0.5) * 10,
      change24h: (Math.random() - 0.5) * 10,
      volume24h: 1000000 + Math.random() * 500000,
      marketCap: 9000000000 + Math.random() * 1000000000,
      lastUpdated: new Date(Date.now() - (points - i) * (timeframe === '1h' ? 60000 : 3600000))
    });
  }
  
  return history;
}
