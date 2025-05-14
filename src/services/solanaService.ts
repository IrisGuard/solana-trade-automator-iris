
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { walletService } from './solana/walletService';
import { tokenService } from './solana/tokenService';
import { Transaction } from '@/types/transaction';
import { TransactionService } from './solana/transaction/TransactionService';
import { parseTransactions } from './solana/transaction/parseTransaction';
import { logError } from '@/utils/errorUtils';

// Create a default connection to the Solana network
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

/**
 * Unified service to interact with Solana blockchain
 */
export const solanaService = {
  /**
   * Get SOL balance for an address
   */
  async getSolBalance(address: string): Promise<number> {
    try {
      return await walletService.getSolBalance(connection, address);
    } catch (error) {
      logError('Error fetching SOL balance', 'solanaService', { action: 'getSolBalance', address });
      return 0;
    }
  },
  
  /**
   * Send SOL to another address
   */
  async sendSol(from: string, to: string, amount: number): Promise<string> {
    try {
      // Implementation would go here
      // This is just a stub for now
      return 'transaction-signature-placeholder';
    } catch (error) {
      logError('Error sending SOL', 'solanaService', { 
        action: 'sendSol', 
        from, 
        to, 
        amount, 
        tokenAddress: 'SOL' 
      });
      throw error;
    }
  },
  
  /**
   * Fetch all transactions for a wallet
   */
  async fetchTransactions(address: string, limit = 10): Promise<Transaction[]> {
    try {
      const txService = new TransactionService(connection);
      const transactions = await txService.getTransactions(address, limit);
      return parseTransactions(transactions);
    } catch (error) {
      logError('Error fetching transactions', 'solanaService', { action: 'fetchTransactions', address });
      return [];
    }
  },
  
  /**
   * Fetch token balances for a wallet
   */
  async fetchAllTokenBalances(address: string) {
    try {
      return await tokenService.getAllTokens(connection, address);
    } catch (error) {
      logError('Error fetching token balances', 'solanaService', { action: 'fetchAllTokenBalances', address });
      return [];
    }
  },
  
  /**
   * Fetch price data for a token
   */
  async fetchTokenPrices(tokenAddress: string) {
    try {
      // Placeholder token price logic 
      // In a real app you'd call CoinGecko, Pyth, or another price oracle
      return {
        price: Math.random() * 100, 
        priceChange24h: (Math.random() * 20) - 10
      };
    } catch (error) {
      logError('Error fetching token prices', 'solanaService', 'fetchTokenPrices');
      return { price: 0, priceChange24h: 0 };
    }
  },
  
  /**
   * Check if a Solana address is valid
   */
  isValidSolanaAddress(address: string): boolean {
    return walletService.isValidSolanaAddress(address);
  }
};
