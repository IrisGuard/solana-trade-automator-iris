import { Transaction } from '@/types/transaction';

/**
 * Merge transactions from API and database
 * @param apiTransactions Transactions from blockchain API
 * @param dbTransactions Transactions from database
 * @returns Merged and sorted transactions
 */
export function mergeTransactions(apiTransactions: Transaction[], dbTransactions: Transaction[]): Transaction[] {
  // Create a map of signatures for fast lookup
  const txMap = new Map<string, Transaction>();
  
  // Add all API transactions to the map
  apiTransactions.forEach(tx => {
    txMap.set(tx.signature, tx);
  });
  
  // Update or add database transactions
  dbTransactions.forEach(tx => {
    // If we already have this transaction from the API, prefer the API data
    // but keep any additional fields from the DB version
    if (txMap.has(tx.signature)) {
      const apiTx = txMap.get(tx.signature)!;
      txMap.set(tx.signature, { ...tx, ...apiTx });
    } else {
      txMap.set(tx.signature, tx);
    }
  });
  
  // Convert map back to array and sort by blockTime (most recent first)
  return Array.from(txMap.values())
    .sort((a, b) => b.blockTime - a.blockTime);
}
