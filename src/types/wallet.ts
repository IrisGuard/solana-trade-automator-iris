
// Token type for wallet tokens
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logo?: string;
}

// Token price information
export interface TokenPrice {
  price: number;
  priceChange24h: number;
  lastUpdated: Date;
}

// Record of token prices by address
export interface TokenPrices {
  [tokenAddress: string]: TokenPrice;
}

// Wallet type for user wallets
export interface Wallet {
  id?: string;
  address: string;
  blockchain?: string;
  is_primary?: boolean;
  last_connected?: string;
}
