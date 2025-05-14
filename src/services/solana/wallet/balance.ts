
import { PublicKey } from '@solana/web3.js';
import { connection } from '../config';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// Export under both names for backward compatibility
export const getSolBalance = async (address: string): Promise<number> => {
  try {
    const publicKey = new PublicKey(address);
    const lamports = await connection.getBalance(publicKey);
    return lamports / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching SOL balance:', error);
    return 0;
  }
};

export const fetchSOLBalance = getSolBalance; // Alias for backward compatibility
