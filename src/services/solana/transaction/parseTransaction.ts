
import { TransactionSignature } from "@solana/web3.js";

export interface ParsedTransaction {
  id: string;
  timestamp: number;
  type: 'transfer' | 'swap' | 'buy' | 'sell' | 'stake' | 'unstake' | 'unknown';
  amount: number;
  token: string;
  usd: number | null;
  fee: number;
  status: 'success' | 'error' | 'pending';
  from: string;
  to: string;
  programId: string;
  blockHeight: number | null;
  description: string;
  blockTime: number;
}

// Helper function to determine transaction type
const determineTransactionType = (transaction: any): ParsedTransaction['type'] => {
  // This is a simplified version - in a real app you would have more complex logic
  // based on the transaction instructions, accounts involved, etc.
  
  if (!transaction || !transaction.meta || !transaction.transaction) {
    return 'unknown';
  }
  
  try {
    // Check for token transfers
    if (transaction.meta.preTokenBalances && 
        transaction.meta.postTokenBalances && 
        transaction.meta.preTokenBalances.length > 0) {
      
      // Compare pre and post balances to determine if it's a transfer
      const preBalances = transaction.meta.preTokenBalances;
      const postBalances = transaction.meta.postTokenBalances;
      
      // Very simplified detection - would need more logic in a real app
      if (preBalances.length === postBalances.length) {
        return 'transfer';
      }
    }
    
    // Check for swaps - usually involves multiple token balance changes
    if (transaction.meta.preTokenBalances && 
        transaction.meta.postTokenBalances && 
        transaction.meta.preTokenBalances.length >= 2 && 
        transaction.meta.postTokenBalances.length >= 2) {
      return 'swap';
    }
    
    // Check for SOL transfers (no token balances, just SOL balance changes)
    if (transaction.meta.preBalances && 
        transaction.meta.postBalances &&
        !transaction.meta.preTokenBalances) {
      return 'transfer';
    }
    
    // Check program IDs for known programs
    const programIds = transaction.transaction.message.instructions
      .map((ix: any) => ix.programId?.toString())
      .filter(Boolean);
    
    if (programIds.some((id: string) => id.includes('11111111111111111111111111111111'))) {
      return 'transfer'; // System program transfers
    }
    
    if (programIds.some((id: string) => 
      id.includes('JUP') || 
      id.includes('RAY') || 
      id.includes('ORCA')
    )) {
      return 'swap'; // DEX related programs
    }
    
    if (programIds.some((id: string) => id.includes('STAKE'))) {
      return 'stake';
    }
  } catch (error) {
    console.error('Error determining transaction type:', error);
  }
  
  return 'unknown';
};

// Helper for extracting timestamp from block time
const extractTimestamp = (transaction: any): number => {
  if (transaction.blockTime) {
    return transaction.blockTime * 1000; // Convert to milliseconds
  }
  return Date.now(); // Fallback to current time
};

// Parse raw transaction data into our standardized format
export const parseTransaction = (transaction: any): ParsedTransaction => {
  try {
    const type = determineTransactionType(transaction);
    const timestamp = extractTimestamp(transaction);
    
    // This is a simplified parser - in a real app, you would extract more details
    // based on the transaction type, instructions, accounts, etc.
    return {
      id: transaction.transaction?.signatures?.[0] || 'unknown',
      timestamp: timestamp,
      type: type,
      amount: 0, // Would need to calculate based on transaction data
      token: 'SOL', // Default, would need to extract from transaction data
      usd: null, // Would need to look up price data
      fee: transaction.meta?.fee || 0,
      status: transaction.meta?.err ? 'error' : 'success',
      from: transaction.transaction?.message?.accountKeys?.[0]?.toString() || 'unknown',
      to: transaction.transaction?.message?.accountKeys?.[1]?.toString() || 'unknown',
      programId: transaction.transaction?.message?.instructions?.[0]?.programId?.toString() || 'unknown',
      blockHeight: transaction.slot || null,
      description: `${type} transaction`,
      blockTime: transaction.blockTime || Math.floor(Date.now() / 1000)
    };
  } catch (error) {
    console.error('Error parsing transaction:', error);
    return {
      id: transaction.transaction?.signatures?.[0] || 'unknown',
      timestamp: Date.now(),
      type: 'unknown',
      amount: 0,
      token: 'unknown',
      usd: null,
      fee: 0,
      status: 'error',
      from: 'unknown',
      to: 'unknown',
      programId: 'unknown',
      blockHeight: null,
      description: 'Failed to parse transaction',
      blockTime: Math.floor(Date.now() / 1000)
    };
  }
};

// Export the parsing function for transactions
export const parseTransactions = (transactions: any[]): ParsedTransaction[] => {
  return transactions
    .filter(tx => tx !== null)
    .map(parseTransaction);
};
