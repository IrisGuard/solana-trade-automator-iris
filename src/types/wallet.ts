
// Define the Token type that's used in wallet-related components
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logo?: string;
  mint?: string;
}

// Add TokenPrice interface
export interface TokenPrice {
  price: number;
  priceChange24h: number;
  lastUpdated?: Date;
}

// Add TokenPrices interface
export interface TokenPrices {
  [tokenAddress: string]: TokenPrice;
}
