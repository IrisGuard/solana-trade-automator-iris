
export interface TokenPriceData {
  price: number;
  priceChange24h: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated: Date;
}

// Add a consistent interface for token prices used throughout the app
export type TokenPrice = {
  price: number;
  priceChange24h: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated?: Date;
};

export type TokenPrices = Record<string, TokenPrice>;
