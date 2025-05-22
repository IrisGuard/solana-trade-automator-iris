
/**
 * Interface representing a token in the wallet
 */
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  mint: string;
  logo?: string;
  price?: number; // Προσθέτουμε την ιδιότητα price ως προαιρετική
}
