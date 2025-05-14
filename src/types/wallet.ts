
export interface Token {
  address: string;
  name?: string;
  symbol: string;
  amount: number;
  decimals: number;
  balance?: number;
  uiBalance?: number;
  mint?: string;
}

export interface WalletBalance {
  sol: number;
  tokens: Token[];
}

export interface Transaction {
  signature: string;
  timestamp: number;
  blockTime?: number;
  status: string;
  type: string;
  amount?: number | string;
  from?: string;
  to?: string;
  tokenAddress?: string;
}
