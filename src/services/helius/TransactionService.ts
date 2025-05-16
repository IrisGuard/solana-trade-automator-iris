
import { HELIUS_BASE_URL } from './HeliusConfig';
import { heliusKeyManager } from './HeliusKeyManager';
import { Transaction } from './types';

class TransactionService {
  private apiKey: string | null = null;
  
  private getApiKey(): string {
    this.apiKey = heliusKeyManager.getApiKey();
    if (!this.apiKey) {
      throw new Error('Helius API key is not available');
    }
    return this.apiKey;
  }
  
  public async getTransactionHistory(walletAddress: string, limit: number = 10): Promise<Transaction[]> {
    try {
      console.log(`Fetching transaction history for wallet: ${walletAddress}, limit: ${limit}`);
      
      // For demo purposes, return mock data
      return Array(limit).fill(0).map((_, index) => ({
        id: `tx_${index}_${Date.now()}`,
        signature: `sig_${Math.random().toString(36).substring(2, 15)}`,
        type: index % 3 === 0 ? 'SEND' : index % 3 === 1 ? 'RECEIVE' : 'SWAP',
        status: index % 5 === 0 ? 'Failed' : 'Success',
        amount: Math.random() * 100,
        timestamp: Date.now() - index * 3600000, // hours ago
      }));
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }
}

export const transactionService = new TransactionService();
export type { TransactionService };
