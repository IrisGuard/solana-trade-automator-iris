
import { fetchRecentTransactions } from './fetchTransactions';
import { parseTransaction } from './parseTransaction';
import { TransactionSignatureResult } from './types';

// Export named function for individual import
export const fetchTransactionHistory = fetchRecentTransactions;

// Export all transaction services
export const transactionService = {
  getRecentTransactions: fetchRecentTransactions,
  parseTransaction,
};
