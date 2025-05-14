
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { logError } from '@/utils/errorUtils';

/**
 * Service for wallet-related operations
 */
export const walletService = {
  /**
   * Check if a Solana address is valid
   */
  isValidSolanaAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  },
  
  /**
   * Get SOL balance for an address
   */
  async getSolBalance(connection: Connection, address: string): Promise<number> {
    try {
      if (!this.isValidSolanaAddress(address)) {
        throw new Error('Invalid Solana address');
      }
      
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      logError('Failed to get SOL balance', 'walletService', { address });
      throw error;
    }
  },
  
  /**
   * Get account info for a Solana address
   */
  async getAccountInfo(connection: Connection, address: string) {
    try {
      if (!this.isValidSolanaAddress(address)) {
        throw new Error('Invalid Solana address');
      }
      
      const publicKey = new PublicKey(address);
      const accountInfo = await connection.getAccountInfo(publicKey);
      return accountInfo;
    } catch (error) {
      logError('Failed to get account info', 'walletService', { address });
      throw error;
    }
  },
  
  /**
   * Request an airdrop to an address (devnet only)
   */
  async requestAirdrop(connection: Connection, address: string, amount = 1): Promise<string> {
    try {
      if (!this.isValidSolanaAddress(address)) {
        throw new Error('Invalid Solana address');
      }
      
      const publicKey = new PublicKey(address);
      const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
      
      await connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      logError('Failed to request airdrop', 'walletService', { address, error: String(error) });
      throw error;
    }
  }
};
