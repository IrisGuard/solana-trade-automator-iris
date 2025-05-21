
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  mint: string;
  logo?: string;
}

export interface WalletBalance {
  sol: number;
  tokens: Token[];
}
