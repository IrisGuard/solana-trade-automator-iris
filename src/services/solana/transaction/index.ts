
import { fetchRecentTransactions } from './fetchTransactions';
import { saveTransactionToDatabase } from './databaseService';

export const transactionService = {
  // Transaction functionality
  getRecentTransactions: fetchRecentTransactions,
  saveTransaction: saveTransactionToDatabase
};
