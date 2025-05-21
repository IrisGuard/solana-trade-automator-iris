
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
  mint: string;
  owner: string;
  amount: string;
  decimals: number;
}

export interface TokenDetails extends Token {
  price?: number;
  value?: number;
  change24h?: number;
}
