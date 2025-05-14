
import { connection } from '../config';
import { fetchSOLBalance } from '../walletService';
import { sendToken } from './transfer';

// Δημιουργώ το balance.ts για να παρέχει το getSolBalance
<lov-write file_path="src/services/solana/wallet/balance.ts">
import { PublicKey } from '@solana/web3.js';
import { connection } from '../config';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

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
