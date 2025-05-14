
import type { ParsedTransaction, Transaction } from '@/types/transaction';

class TransactionService {
  static async getTransactions(address: string, limit: number = 10): Promise<Transaction[]> {
    try {
      // Fetch transactions logic would go here
      return [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  static parseTransactions(transactions: ParsedTransaction): Transaction[] {
    if (!transactions || !Array.isArray(transactions)) {
      return [];
    }

    return transactions.map((tx: any) => ({
      id: tx.id,
      signature: tx.signature,
      blockTime: tx.blockTime,
      timestamp: tx.blockTime, // Add timestamp
      status: tx.status,
      amount: tx.amount,
      type: tx.type,
      source: tx.source,
      destination: tx.destination
    }));
  }
}

export { TransactionService };
