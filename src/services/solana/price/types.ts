
export interface TokenPriceData {
  price: number;
  priceChange24h: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated: Date;
}

export interface TokenPriceInfo {
  price: number;
  priceChange24h: number;
  change24h?: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated?: Date;
  currentPrice?: number;
}
