
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logoURI?: string;
  logo?: string; // Add both logoURI and logo for compatibility
  mint?: string; // Add mint property for Solana tokens
}

export interface TokenPrice {
  price: number;
  change24h: number;
  priceChange24h?: number; // Add alias for compatibility
  volume24h?: number;
  marketCap?: number;
  lastUpdated?: Date;
}

export interface TokenPrices {
  [tokenAddress: string]: TokenPrice;
}

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string | null;
  balance: number;
  tokens: Token[];
  tokenPrices: TokenPrices;
  isLoadingTokens: boolean;
  error: string | null;
}
