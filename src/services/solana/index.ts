import { PublicKey } from '@solana/web3.js';
import { connection } from './config';
import { tokenService } from './token';

// Main Solana service object for the application
export const solanaService = {
  // Fetch SOL balance for an address
  fetchSOLBalance: async (address: string): Promise<number> => {
    try {
      const publicKey = new PublicKey(address);
      const lamports = await connection.getBalance(publicKey);
      return lamports / 10**9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      throw error;
    }
  },
  
  // Re-export token service
  tokenService,
  
  // Other Solana services can be added here
};
