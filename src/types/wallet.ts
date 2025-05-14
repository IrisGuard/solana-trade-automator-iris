
export interface Token {
  address: string;
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: number;
  uiBalance: number;
  amount?: number; // Προσθήκη του amount πεδίου που λείπει
}

export interface TokenAccount {
  address: string;
  mint: string;
  amount: number;
  decimals: number;
  uiAmount: number;
}

export interface TokenPriceInfo {
  price: number;
  priceChange24h: number;
}
