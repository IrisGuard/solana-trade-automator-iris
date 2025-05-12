
import { fetchRecentTransactions } from './fetchTransactions';
import { parseTransaction } from './parseTransaction';
import { TransactionSignatureResult } from './types';

// Export all transaction services
export const transactionService = {
  getRecentTransactions: fetchRecentTransactions,
  parseTransaction,
  // Επιπλέον μέθοδοι που μπορούν να προστεθούν μελλοντικά
};
