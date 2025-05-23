
export interface TokenPrice {
  price: number;
  priceChange24h: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface TokenPrices {
  [tokenAddress: string]: TokenPrice;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}
