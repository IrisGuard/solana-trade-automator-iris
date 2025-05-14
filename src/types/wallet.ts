
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
  balance?: number; 
  uiBalance?: number;
  mint?: string; // Added to support old code references
}

/**
 * Αντιπροσωπεύει μια συναλλαγή
 */
export interface Transaction {
  // Basic transaction properties
  signature: string;
  blockTime: number;
  timestamp: number;
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

// Re-export the Transaction type from transaction.ts for backward compatibility
export { Transaction as Transaction } from '@/types/transaction';
