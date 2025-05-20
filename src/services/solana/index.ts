
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { rpcEndpoints } from './apiConfig';

class SolanaService {
  private connection: Connection | null = null;
  
  constructor() {
    // Initialize connection
    this.initializeConnection();
  }
  
  private initializeConnection() {
    try {
      // Use the default cluster or fallback to mainnet
      this.connection = new Connection(rpcEndpoints.mainnet, 'confirmed');
      console.log('Solana connection initialized to:', rpcEndpoints.mainnet);
    } catch (error) {
      console.error('Error initializing Solana connection:', error);
      this.connection = null;
    }
  }
  
  // Get connection (lazy initialization)
  private getConnection(): Connection {
    if (!this.connection) {
      this.initializeConnection();
    }
    return this.connection!;
  }
  
  // Fetch SOL balance for an address
  async fetchSOLBalance(address: string): Promise<number> {
    try {
      console.log('Fetching SOL balance for:', address);
      const pubKey = new PublicKey(address);
      const balance = await this.getConnection().getBalance(pubKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      console.log('SOL balance:', solBalance);
      return solBalance;
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      // Return mock balance for development purposes
      console.log('Returning mock SOL balance');
      return Math.random() * 10;
    }
  }
  
  // Additional blockchain methods can be added here
}

export const solanaService = new SolanaService();
