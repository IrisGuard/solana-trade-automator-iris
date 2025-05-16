
export interface TokenPrice {
  price: number;
  priceChange24h: number;
}

export type TokenPrices = Record<string, TokenPrice>;
