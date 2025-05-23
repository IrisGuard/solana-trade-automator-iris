
import { PublicKey } from '@solana/web3.js';
import { connectionManager } from '@/services/solana/rpc/ConnectionManager';
import { errorCollector } from '@/utils/error-handling/collector';

class SolanaService {
  async getBalance(publicKey: string): Promise<number> {
    try {
      const pubKey = new PublicKey(publicKey);
      
      const balance = await connectionManager.executeWithFallback(async (connection) => {
        return await connection.getBalance(pubKey);
      });
      
      return balance / 1000000000; // Convert from lamports to SOL
    } catch (error) {
      console.error('[SolanaService] Error getting balance:', error);
      errorCollector.captureError(error as Error, {
        component: 'SolanaService',
        source: 'getBalance',
        details: { publicKey }
      });
      throw error;
    }
  }

  async getTokenAccounts(publicKey: string) {
    try {
      const pubKey = new PublicKey(publicKey);
      
      const tokenAccounts = await connectionManager.executeWithFallback(async (connection) => {
        return await connection.getParsedTokenAccountsByOwner(pubKey, {
          programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        });
      });
      
      return tokenAccounts.value;
    } catch (error) {
      console.error('[SolanaService] Error getting token accounts:', error);
      errorCollector.captureError(error as Error, {
        component: 'SolanaService',
        source: 'getTokenAccounts', 
        details: { publicKey }
      });
      throw error;
    }
  }

  async getTransactionHistory(publicKey: string, limit: number = 10) {
    try {
      const pubKey = new PublicKey(publicKey);
      
      const signatures = await connectionManager.executeWithFallback(async (connection) => {
        return await connection.getSignaturesForAddress(pubKey, { limit });
      });
      
      return signatures;
    } catch (error) {
      console.error('[SolanaService] Error getting transaction history:', error);
      errorCollector.captureError(error as Error, {
        component: 'SolanaService',
        source: 'getTransactionHistory',
        details: { publicKey, limit }
      });
      throw error;
    }
  }

  getConnection() {
    return connectionManager.getConnection();
  }
}

export const solanaService = new SolanaService();
export default solanaService;
