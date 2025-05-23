
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logoURI?: string;
  logo?: string;
  mint?: string;
}

export interface TokenPrice {
  price: number;
  change24h: number;
  priceChange24h?: number;
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

export interface TokenBalance {
  mint: string;
  owner: string;
  amount: number;
  decimals: number;
}

export interface TokenDetails extends Token {
  price?: number;
  value?: number;
  change24h?: number;
}
