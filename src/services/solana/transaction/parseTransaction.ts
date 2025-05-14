
import { PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { Transaction } from '@/types/wallet';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function parseTransaction(
  tx: ParsedTransactionWithMeta,
  signature: string,
  timestamp: number,
  walletPublicKey: PublicKey
): Transaction {
  try {
    // Βασικές πληροφορίες συναλλαγής
    const baseTransaction: Transaction = {
      signature,
      timestamp: new Date(timestamp * 1000),
      successful: tx.meta?.err === null,
      fee: (tx.meta?.fee || 0) / LAMPORTS_PER_SOL,
      type: 'unknown',
      amount: 0,
      sender: '',
      recipient: '',
      token: 'SOL'
    };

    // Προς το παρόν επιστρέφουμε τις βασικές πληροφορίες
    // Σε μελλοντικές εκδόσεις θα προσθέσουμε περισσότερη ανάλυση
    return baseTransaction;
  } catch (error) {
    console.error('Error parsing transaction:', error);
    
    // Επιστροφή βασικής δομής με ελάχιστες πληροφορίες σε περίπτωση σφάλματος
    return {
      signature,
      timestamp: new Date(timestamp * 1000),
      successful: false,
      fee: 0,
      type: 'error',
      amount: 0,
      sender: '',
      recipient: '',
      token: ''
    };
  }
}
