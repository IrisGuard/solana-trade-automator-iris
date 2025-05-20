
/**
 * Represents a Solana token account with parsed data
 */
export interface TokenAccount {
  address: string;
  mint: string;
  owner: string;
  tokenAmount: string;
  decimals: number;
  uiAmount: number | null;
  uiAmountString: string;
}

/**
 * Represents token data structure for the application
 */
export interface TokenData {
  address: string;
  mint?: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logo?: string;
}
