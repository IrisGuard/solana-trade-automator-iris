
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
