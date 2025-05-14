
/**
 * Αντιπροσωπεύει ένα token 
 */
export interface Token {
  address: string;
  symbol: string;
  name: string;
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
export interface WalletTransaction {
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
export type { Transaction } from '@/types/transaction';
