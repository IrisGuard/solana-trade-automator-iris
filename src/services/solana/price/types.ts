
export interface TokenPrice {
  price: number;
  change24h: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated?: Date;
}

// Alias for TokenPriceData for compatibility
export type TokenPriceData = TokenPrice;

export interface TokenPrices {
  [tokenAddress: string]: TokenPrice;
}
