
export interface TokenPrice {
  price: number;
  change24h: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated?: Date;
}

export interface TokenPrices {
  [tokenAddress: string]: TokenPrice;
}
