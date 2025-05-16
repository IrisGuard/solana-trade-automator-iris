
// Define the Token type that's used in wallet-related components
export interface Token {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logo?: string;
  mint?: string;
}
