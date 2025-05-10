
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
              const accountKeysObj = message.getAccountKeys();
              
              // Properly handle the account keys object
              if (accountKeysObj && typeof accountKeysObj === 'object') {
                // Check if staticAccountKeys is available (newer versions of web3.js)
                if ('staticAccountKeys' in accountKeysObj) {
                  const staticKeys = accountKeysObj.staticAccountKeys;
                  if (Array.isArray(staticKeys) && accountIndex < staticKeys.length) {
                    accountKey = staticKeys[accountIndex].toBase58();
                  }
                } 
                // Fallback to using get method if it exists as a function
                else if (typeof accountKeysObj.get === 'function') {
                  try {
                    const pubkey = accountKeysObj.get(accountIndex);
                    if (pubkey) {
                      accountKey = pubkey.toBase58();
                    }
                  } catch (err) {
                    console.error('Error accessing account key:', err);
                  }
                }
                // Additional fallback to handle common alternate structures
                else if (Array.isArray(accountKeysObj)) {
                  // Some versions might return an array directly
                  if (accountIndex < accountKeysObj.length) {
                    const key = accountKeysObj[accountIndex];
                    if (key && typeof key.toBase58 === 'function') {
                      accountKey = key.toBase58();
                    }
                  }
                }
              }
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
