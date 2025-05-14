
import { PublicKey } from '@solana/web3.js';
import { connection } from '../config';
import { toast } from 'sonner';
import { Transaction } from '@/types/wallet';
import { parseTransaction } from './parseTransaction';

/**
 * Get recent transactions for a wallet address
 */
export async function fetchRecentTransactions(address: string, limit = 10): Promise<Transaction[]> {
  try {
    const publicKey = new PublicKey(address);
    
    // Get signatures for the recent transactions
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit });
    
    if (signatures.length === 0) return [];
    
    // Get transaction details
    const transactionDetails = await connection.getParsedTransactions(
      signatures.map(sig => sig.signature)
    );
    
    // Transform the data into a Transaction[] array
    const transactions: Transaction[] = transactionDetails
      .filter(tx => tx !== null)
      .map((tx, index) => {
        const signature = signatures[index].signature;
        const timestamp = signatures[index].blockTime || 0;
        
        return parseTransaction(tx!, signature, timestamp, publicKey);
      });
    
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    toast.error('Αδυναμία φόρτωσης συναλλαγών');
    return [];
  }
}
