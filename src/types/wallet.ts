
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logo?: string;
}

export interface WalletInfo {
  address: string;
  balance: number;
  tokens: Token[];
  isConnected: boolean;
}

export interface TokenPrices {
  [tokenAddress: string]: {
    price: number;
    priceChange24h: number;
    lastUpdated: Date;
  };
}
