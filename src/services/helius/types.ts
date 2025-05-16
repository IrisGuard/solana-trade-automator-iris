
export interface Transaction {
  id?: string;
  signature?: string;
  type: string;
  status: string;
  amount?: number | string;
  timestamp?: number;
  from?: string;
  to?: string;
}

export interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
}

export interface TokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  logoURI?: string;
}
