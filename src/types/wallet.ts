
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logo?: string;
  mint?: string; // Adding mint property for consistency
}
