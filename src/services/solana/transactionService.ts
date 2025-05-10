
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Transaction } from '@/types/wallet';
import { connection } from './config';

export const transactionService = {
  // Get recent transactions with details
  getRecentTransactions: async (address: string, limit = 10): Promise<Transaction[]> => {
    try {
      const publicKey = new PublicKey(address);
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit });
      
      const transactions: Transaction[] = [];
      
      for (const sig of signatures) {
        try {
          // Get full transaction info
          const txInfo = await connection.getTransaction(sig.signature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0
          });
          
          if (!txInfo) continue;
          
          let type = 'Συναλλαγή';
          let amount = '';
          let from = '';
          let to = '';
          
          // Try to identify transaction type and amount
          if (txInfo.meta && txInfo.meta.preTokenBalances && txInfo.meta.postTokenBalances) {
            // Possible token transaction
            if (txInfo.meta.preTokenBalances.length > 0 || txInfo.meta.postTokenBalances.length > 0) {
              type = 'Token';
            }
          }
          
          // Check for SOL transfers
          if (txInfo.meta && txInfo.meta.preBalances && txInfo.meta.postBalances) {
            const preBalances = txInfo.meta.preBalances;
            const postBalances = txInfo.meta.postBalances;
            
            if (preBalances.length > 0 && postBalances.length > 0) {
              // Fix for versioned transactions - use getAccountKeys() instead of accountKeys
              let accountKeys;
              if (typeof txInfo.transaction.message.getAccountKeys === 'function') {
                // For versioned transactions
                accountKeys = txInfo.transaction.message.getAccountKeys();
              } else {
                // For legacy transactions - fallback to direct access if needed
                // This should handle older transaction formats
                accountKeys = txInfo.transaction.message.accountKeys || [];
              }
              
              if (accountKeys) {
                const accountIndex = accountKeys.findIndex(
                  key => key.toString() === address
                );
                
                if (accountIndex >= 0) {
                  const balanceDiff = (postBalances[accountIndex] - preBalances[accountIndex]) / LAMPORTS_PER_SOL;
                  
                  if (balanceDiff > 0) {
                    type = 'Κατάθεση';
                    amount = `+${balanceDiff.toFixed(5)} SOL`;
                  } else if (balanceDiff < 0) {
                    type = 'Ανάληψη';
                    amount = `${balanceDiff.toFixed(5)} SOL`;
                  }
                }
              }
            }
          }
          
          transactions.push({
            signature: sig.signature,
            blockTime: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
            status: sig.err ? 'αποτυχία' : 'επιβεβαιώθηκε',
            type,
            amount,
            from,
            to
          });
        } catch (txError) {
          console.error('Error retrieving transaction details:', txError);
          // Add basic information if retrieval of details fails
          transactions.push({
            signature: sig.signature,
            blockTime: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
            status: sig.err ? 'αποτυχία' : 'επιβεβαιώθηκε',
            type: 'Συναλλαγή'
          });
        }
      }
      
      return transactions;
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }
};
