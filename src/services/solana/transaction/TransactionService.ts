
import { Connection } from '@solana/web3.js';
import { fetchTransactionsByAddress } from './fetchTransactions';
import { ParsedTransaction } from './parseTransaction';

/**
 * Service for handling Solana transaction operations
 */
export class TransactionService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Get transactions for a wallet address
   * @param address Wallet address
   * @param limit Maximum number of transactions to return
   */
  async getTransactions(address: string, limit: number = 10): Promise<any[]> {
    try {
      return await fetchTransactionsByAddress(address, limit);
    } catch (error) {
      console.error('Error in TransactionService.getTransactions:', error);
      return [];
    }
  }
}
