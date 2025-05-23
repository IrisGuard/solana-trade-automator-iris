
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { errorCollector } from '@/utils/error-handling/collector';

class SolanaService {
  private connection: Connection;

  constructor() {
    // Use mainnet-beta for production, devnet for development
    const endpoint = process.env.NODE_ENV === 'production' 
      ? clusterApiUrl('mainnet-beta')
      : clusterApiUrl('devnet');
    
    this.connection = new Connection(endpoint);
  }

  async getBalance(publicKey: string): Promise<number> {
    try {
      const pubKey = new PublicKey(publicKey);
      const balance = await this.connection.getBalance(pubKey);
      return balance / 1000000000; // Convert from lamports to SOL
    } catch (error) {
      errorCollector.captureError(error, {
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
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(pubKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      });
      return tokenAccounts.value;
    } catch (error) {
      errorCollector.captureError(error, {
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
      const signatures = await this.connection.getSignaturesForAddress(pubKey, { limit });
      return signatures;
    } catch (error) {
      errorCollector.captureError(error, {
        component: 'SolanaService',
        source: 'getTransactionHistory',
        details: { publicKey, limit }
      });
      throw error;
    }
  }

  getConnection(): Connection {
    return this.connection;
  }
}

export const solanaService = new SolanaService();
export default solanaService;
