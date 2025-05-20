
export interface Token {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  logo?: string;
  mint: string;
}

export interface TokenBalance {
  address: string;
  balance: number;
}

export interface TokenPriceData {
  price: number;
  change24h: number;
}

export interface WalletData {
  address: string;
  balance: number;
  tokens: Token[];
}

export type TokenPrices = Record<string, { price: number; priceChange24h: number }>;
