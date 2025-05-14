
import { Transaction } from '@/types/transaction';
import { parseTransaction } from './parseTransaction';
import { errorCollector } from '@/utils/error-handling/collector';

/**
 * Υπηρεσία διαχείρισης συναλλαγών Solana
 */
export class TransactionService {
  /**
   * Λήψη των συναλλαγών για μια διεύθυνση wallet
   */
  static async getTransactions(walletAddress: string): Promise<Transaction[]> {
    try {
      // Υλοποίηση για λήψη συναλλαγών
      const parsedTransactions = await parseTransaction(walletAddress);
      
      // Μετατροπή του ParsedTransaction σε Transaction
      if (Array.isArray(parsedTransactions)) {
        return parsedTransactions.map(tx => ({
          id: tx.id || Math.random().toString(36).substring(2, 15),
          signature: tx.signature || '',
          blockTime: tx.blockTime,
          status: tx.status || 'confirmed',
          amount: tx.amount?.toString() || '0',
          type: tx.type || 'unknown',
          source: tx.from,
          destination: tx.to
        }));
      }
      
      // Αν το parsedTransactions δεν είναι πίνακας, επέστρεψε έναν άδειο πίνακα
      return [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get transactions'), {
        component: 'TransactionService',
        source: 'client'
      });
      return [];
    }
  }
}
