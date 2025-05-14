
/**
 * Αντιπροσωπεύει ένα token στο πορτοφόλι του χρήστη
 */
export interface Token {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  logo?: string;
  price?: number;
}
