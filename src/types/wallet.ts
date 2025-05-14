
export interface Token {
  address: string;
  name?: string;
  symbol?: string;
  logo?: string;
  decimals?: number;
  amount?: number;
  balance?: number;
  uiBalance?: number;
  mint?: string;
}

export interface TokenPrice {
  price: number;
  priceChange24h: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated?: Date;
}

export interface WalletTransaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'other';
  amount: number;
  token: string;
  timestamp: Date | string;
  status: 'confirmed' | 'pending' | 'failed';
  from?: string;
  to?: string;
  signature?: string;
  fee?: number;
}

export interface WalletBalance {
  sol: number;
  tokens: Token[];
}

export type WalletProvider = 'phantom' | 'solflare' | 'slope' | 'sollet' | 'other';

export interface WalletStatus {
  isConnected: boolean;
  isConnecting: boolean;
  address?: string;
  provider?: WalletProvider;
}
