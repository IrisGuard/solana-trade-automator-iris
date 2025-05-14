
export interface Transaction {
  // Basic transaction properties
  signature: string;
  blockTime: number;
  timestamp: number; // Τώρα είναι υποχρεωτικό
  status: string;
  type: string;
  
  // Amount and value information
  amount?: string;  // Πάντα string, όχι number
  price?: string | number;
  value?: string | number;
  
  // Token information
  token?: string;
  tokenAddress?: string;
  
  // Transaction parties
  from?: string;
  to?: string;
  
  // Additional information
  bot?: string;
  id?: string;
}
