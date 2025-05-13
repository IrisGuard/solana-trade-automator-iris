
import { toast } from 'sonner';

export interface TokenPriceData {
  price: number;
  priceChange24h: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated: Date;
}

// Mock price data - in a real app, this would fetch from APIs like CoinGecko
const MOCK_PRICE_DATA: Record<string, TokenPriceData> = {
  'So11111111111111111111111111111111111111112': { // SOL
    price: 122.45,
    priceChange24h: 3.2,
    volume24h: 1200000000,
    marketCap: 52000000000,
    lastUpdated: new Date()
  },
};

// Add some price volatility to make the demo more realistic
function getVolatilePrice(basePrice: number): number {
  const volatilityPercent = 0.5; // 0.5% volatility
  const randomFactor = 1 + (Math.random() * volatilityPercent * 2 - volatilityPercent) / 100;
  return basePrice * randomFactor;
}

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

// Subscribe to price updates for a token
export function subscribeToPriceUpdates(
  tokenAddress: string,
  callback: (priceData: TokenPriceData) => void
): () => void {
  // In a real app, this would set up a websocket or polling mechanism
  const intervalId = setInterval(async () => {
    const price = await getTokenPrice(tokenAddress);
    callback(price);
  }, 10000); // Update every 10 seconds
  
  // Return unsubscribe function
  return () => clearInterval(intervalId);
}

// Export services
export const priceService = {
  getTokenPrice,
  subscribeToPriceUpdates
};
