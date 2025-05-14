
import type { Token } from '@/types/wallet';

// Re-export with proper syntax for isolated modules
export type { Token };

// Add TokenPrice type for consistency
export interface TokenPrice {
  price: number;
  priceChange24h: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated?: Date;
}

export type TokenPrices = Record<string, TokenPrice>;
