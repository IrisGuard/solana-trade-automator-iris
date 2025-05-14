
export interface Token {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  logo?: string;
  price?: number;
  decimals?: number;
}

export interface Transaction {
  signature: string;
  blockTime: number;
  timestamp?: number; // Add timestamp to make it compatible
  type: string;
  status: string;
  amount?: string | number; // Change to accept number too
  from?: string;
  to?: string;
  tokenAddress?: string;
}

export interface WalletState {
  isConnected: boolean;
  walletAddress: string;
  balance: number | null;
  error: string | null;
  isConnecting: boolean;
  tokens: Token[];
}
