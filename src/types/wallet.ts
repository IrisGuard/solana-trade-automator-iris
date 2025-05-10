
export interface Token {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  logo?: string;
}

export interface Transaction {
  signature: string;
  blockTime: number;
  type: string;
  status: string;
  amount?: string;
  from?: string;
  to?: string;
}

export interface WalletState {
  isConnected: boolean;
  walletAddress: string;
  balance: number | null;
  error: string | null;
  isConnecting: boolean;
  tokens: Token[];
}
