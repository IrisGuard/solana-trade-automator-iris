
export interface TokenPrice {
  price: number;
  change24h?: number;
}

export interface TokenPrices {
  [tokenAddress: string]: TokenPrice;
}
