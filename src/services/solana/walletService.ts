
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { connection } from './config';

export const walletService = {
  // Get connection instance
  getConnection: () => connection,
  
  // Get SOL balance for a given address
  getSolBalance: async (address: string): Promise<number> => {
    try {
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL; // Convert from lamports to SOL
    } catch (error) {
      console.error('Error getting SOL balance:', error);
      toast.error('Failed to get SOL balance');
      return 0;
    }
  },
  
  // Send token functionality (to be implemented)
  sendToken: async () => {
    // To be implemented in the future
    toast.error('Token sending functionality has not been implemented yet');
    return false;
  }
};
