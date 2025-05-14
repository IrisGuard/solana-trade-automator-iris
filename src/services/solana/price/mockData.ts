
import { TokenPriceData } from './types';

// Mock price data για γνωστά tokens
export const MOCK_PRICE_DATA: Record<string, TokenPriceData> = {
  'So11111111111111111111111111111111111111112': { // SOL
    price: 122.45,
    priceChange24h: 3.2,
    volume24h: 1200000000,
    marketCap: 52000000000,
    lastUpdated: new Date()
  },
  // Προσθήκη περισσότερων mock τιμών για άλλα γνωστά tokens αν χρειάζεται
};

// Προσθήκη μεταβλητότητας στην τιμή για πιο ρεαλιστικό demo
export function getVolatilePrice(basePrice: number): number {
  const volatilityPercent = 0.5; // 0.5% μεταβλητότητα
  const randomFactor = 1 + (Math.random() * volatilityPercent * 2 - volatilityPercent) / 100;
  return basePrice * randomFactor;
}

