
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logoURI?: string;
}

export interface TokenPrice {
  price: number;
  change24h: number;
}

export interface TokenPrices {
  [tokenAddress: string]: TokenPrice;
}
