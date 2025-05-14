
export interface Token {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  decimals?: number;
  logo?: string;
}

export interface TokenPrice {
  price: number;
  priceChange24h: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated: Date;
}

export type TokenPrices = Record<string, TokenPrice>;
