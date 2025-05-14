
export interface Transaction {
  // Basic transaction properties
  signature: string;
  blockTime: number;
  timestamp: number;
  status: string;
  type: string;
  
  // Amount and value information
  amount?: string;  // Changed from string | number to string only
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
