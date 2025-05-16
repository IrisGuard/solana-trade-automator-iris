
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logo?: string;
}

export interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
}

export interface TokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  logoURI?: string;
}

export type TokenPrices = Record<string, { price: number; priceChange24h: number }>;
