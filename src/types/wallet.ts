
/**
 * Interface for token data structure
 */
export interface Token {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  balance?: number;
  uiBalance?: number;
  mint?: string;
  logo?: string;
}

/**
 * Interface for transaction data structure
 */
export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'other';
  amount: number;
  token: string;
  tokenSymbol: string;
  date: Date | string;
  status: 'confirmed' | 'pending' | 'failed';
  from?: string;
  to?: string;
  fee?: number;
}

/**
 * Interface for wallet data structure
 */
export interface WalletData {
  address: string;
  balance: number;
  tokens: Token[];
  transactions: Transaction[];
}

/**
 * Interface for price data structure
 */
export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h?: number;
  marketCap?: number;
}

/**
 * Interface for wallet settings
 */
export interface WalletSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  showTestTokens: boolean;
  defaultCurrency: string;
}

/**
 * Interface for wallet connection state
 */
export interface WalletConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  wallet: string | null;
  provider: any;
  error: string | null;
}
