
export interface Token {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  logo?: string;
  mint: string; // Add this property to match tokenService usage
}

export interface TokenBalance {
  address: string;
  balance: number;
}

export interface TokenPriceData {
  price: number;
  change24h: number;
}

export interface WalletData {
  address: string;
  balance: number;
  tokens: Token[];
}
