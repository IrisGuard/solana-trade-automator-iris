
// Common types for Helius API responses

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
  decimals: number;
}

export interface Transaction {
  signature: string;
  type?: string;
  timestamp: string;
  tokenTransfers?: Array<{
    tokenName?: string;
    amount?: number;
    decimals?: number;
  }>;
  nativeTransfers?: Array<{
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }>;
}
