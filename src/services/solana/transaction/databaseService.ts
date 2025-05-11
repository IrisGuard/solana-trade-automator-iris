
import { transactionService } from '@/services/transactionService';
import { Transaction } from '@/types/wallet';

/**
 * Save transaction to Supabase 
 */
export async function saveTransactionToDatabase(
  transaction: Transaction, 
  walletAddress: string, 
  userId?: string
): Promise<boolean> {
  try {
    // Using the transaction service to save the transaction
    if (userId) {
      return await transactionService.saveTransactionToDatabase(transaction, walletAddress, userId);
    }
    console.log('Saving transaction to database failed: User ID is undefined');
    return false;
  } catch (error) {
    console.error('Error saving transaction:', error);
    return false;
  }
}
