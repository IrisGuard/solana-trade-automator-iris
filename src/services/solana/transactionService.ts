
import { PublicKey, PartiallyDecodedInstruction, ParsedTransactionWithMeta, Connection } from '@solana/web3.js';
import { Transaction } from '@/types/wallet';
import { connection } from './config';

export const transactionService = {
  // Get recent transactions for a wallet address
  getRecentTransactions: async (address: string, limit = 10): Promise<Transaction[]> => {
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
        .filter((tx): tx is ParsedTransactionWithMeta => tx !== null)
        .map((tx, index) => {
          const signature = signatures[index].signature;
          const timestamp = signatures[index].blockTime || 0;
          
          // Get transaction type
          let type = 'Unknown';
          let status = tx.meta?.err ? 'Failed' : 'Success';
          let amount;
          let from;
          let to;
          let tokenAddress;
          
          // Check if transaction has message and instructions
          if (tx.transaction?.message) {
            const message = tx.transaction.message;
            
            // Get account keys - handle both versioned and legacy transactions
            const accountIndex = tx.meta?.postTokenBalances?.[0]?.accountIndex || 0;
            
            let accountKey;
            // Check if we have a versioned message (has getAccountKeys method) or legacy message
            if ('getAccountKeys' in message) {
              // For versioned transactions (MessageV0)
              const accountKeys = message.getAccountKeys();
              // Use the get method directly on accountKeys object
              accountKey = accountKeys?.get?.(accountIndex)?.toBase58();
            } else {
              // For legacy transactions
              accountKey = message.accountKeys?.[accountIndex]?.toString();
            }
            
            // If the first account is the user's account, it's likely an outgoing transaction
            if (accountKey === publicKey.toBase58()) {
              type = 'Send';
              amount = `-${tx.meta?.fee ? tx.meta.fee / 1e9 : 0} SOL`;
            } else {
              type = 'Receive';
              amount = `+${tx.meta?.fee ? tx.meta.fee / 1e9 : 0} SOL`;
            }
          }
          
          return {
            signature,
            blockTime: timestamp * 1000, // Convert to milliseconds
            type,
            status,
            amount,
            from,
            to,
            tokenAddress
          };
        });
      
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }
};
