
import { PublicKey, PartiallyDecodedInstruction, ParsedTransactionWithMeta, Connection } from '@solana/web3.js';
import { Transaction } from '@/types/wallet';
import { connection } from './config';
import { toast } from 'sonner';
import { transactionService as dbTransactionService } from '../transactionService';

// Helper type guard
function hasGetAccountKeysMethod(obj: any): obj is { getAccountKeys(): any } {
  return obj && typeof obj.getAccountKeys === 'function';
}

// Helper to determine transaction type based on program ID
function determineTransactionType(programId: string): string {
  // Common program IDs
  const KNOWN_PROGRAMS: Record<string, string> = {
    '11111111111111111111111111111111': 'System', // System Program
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'Token', // Token Program
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': 'Associated Token', // Associated Token Program
    'JUP4Fb2cqiRUcaTHdrPC8h2gNsA8fvKzYqvzNhQnuSF': 'Jupiter', // Jupiter Aggregator
  };

  return KNOWN_PROGRAMS[programId] || 'Unknown';
}

// Helper to format SOL amount
function formatSolAmount(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return sol.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 9 });
}

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
          let amount: string | undefined;
          let from: string | undefined;
          let to: string | undefined;
          let tokenAddress: string | undefined;
          
          // Check if transaction has message and instructions
          if (tx.transaction?.message) {
            const message = tx.transaction.message;
            
            // Try to determine transaction type from instructions
            if (message.instructions && message.instructions.length > 0) {
              const mainInstruction = message.instructions[0];
              if ('programId' in mainInstruction) {
                const programId = (mainInstruction as PartiallyDecodedInstruction).programId.toString();
                type = determineTransactionType(programId);
              }
            }
            
            // Get account keys - handle both versioned and legacy transactions
            const accountIndex = tx.meta?.postTokenBalances?.[0]?.accountIndex || 0;
            
            let accountKey;
            // Use proper type guard to check if we have a versioned message
            if (hasGetAccountKeysMethod(message)) {
              // For versioned transactions (MessageV0)
              try {
                const accountKeys = message.getAccountKeys();
                
                // Check if accountKeys has staticAccountKeys property
                if (accountKeys && typeof accountKeys === 'object') {
                  if ('staticAccountKeys' in accountKeys && Array.isArray(accountKeys.staticAccountKeys)) {
                    // Direct access to staticAccountKeys
                    const staticKeys = accountKeys.staticAccountKeys;
                    if (accountIndex < staticKeys.length) {
                      accountKey = staticKeys[accountIndex].toBase58();
                    }
                  } else if (Array.isArray(accountKeys)) {
                    // Handle array return type
                    if (accountIndex < accountKeys.length) {
                      const key = accountKeys[accountIndex];
                      if (key && typeof key.toBase58 === 'function') {
                        accountKey = key.toBase58();
                      }
                    }
                  } else {
                    // Generic object access fallback, safely accessing by property
                    const possibleKey = (accountKeys as Record<string, any>)[accountIndex];
                    if (possibleKey && typeof possibleKey.toBase58 === 'function') {
                      accountKey = possibleKey.toBase58();
                    }
                  }
                }
              } catch (err) {
                console.error('Error accessing account key from versioned transaction:', err);
              }
            } else {
              // For legacy transactions
              if (Array.isArray(message.accountKeys) && accountIndex < message.accountKeys.length) {
                try {
                  accountKey = message.accountKeys[accountIndex].toString();
                } catch (err) {
                  console.error('Error accessing account key from legacy transaction:', err);
                }
              }
            }
            
            // Determine transaction direction and amount
            if (tx.meta) {
              // Set the transaction direction and amount based on pre/post balances
              const preBalance = tx.meta.preBalances[0] || 0;
              const postBalance = tx.meta.postBalances[0] || 0;
              const balanceDiff = postBalance - preBalance;
              
              // If this is the user's account
              if (accountKey === publicKey.toBase58()) {
                // Handle transfer amount
                if (balanceDiff < 0) {
                  // Outgoing transaction (minus the fee)
                  const fee = tx.meta.fee || 0;
                  type = type === 'Unknown' ? 'Send' : type;
                  amount = `-${formatSolAmount(Math.abs(balanceDiff) - fee)} SOL`;
                  
                  // Try to find the recipient
                  if (message.instructions && message.instructions.length > 0) {
                    const instruction = message.instructions[0];
                    if ('parsed' in instruction && 
                        instruction.parsed?.type === 'transfer' && 
                        instruction.parsed.info?.destination) {
                      to = instruction.parsed.info.destination;
                    }
                  }
                  
                  from = publicKey.toBase58();
                } else if (balanceDiff > 0) {
                  // Incoming transaction
                  type = type === 'Unknown' ? 'Receive' : type;
                  amount = `+${formatSolAmount(balanceDiff)} SOL`;
                  
                  // Try to find the sender
                  if (message.instructions && message.instructions.length > 0) {
                    const instruction = message.instructions[0];
                    if ('parsed' in instruction && 
                        instruction.parsed?.type === 'transfer' && 
                        instruction.parsed.info?.source) {
                      from = instruction.parsed.info.source;
                    }
                  }
                  
                  to = publicKey.toBase58();
                } else {
                  // Balance didn't change, but fees were paid
                  amount = `-${formatSolAmount(tx.meta.fee || 0)} SOL`;
                }
              } else {
                // This is not directly the user's account
                // Try to determine if the user's account is involved in the transaction
                if (message.instructions && message.instructions.length > 0) {
                  // Loop through instructions to find transfers
                  for (const instruction of message.instructions) {
                    if ('parsed' in instruction && instruction.parsed?.type === 'transfer') {
                      const info = instruction.parsed.info;
                      if (info?.destination === publicKey.toBase58()) {
                        type = type === 'Unknown' ? 'Receive' : type;
                        amount = `+${formatSolAmount(info.lamports || 0)} SOL`;
                        from = info.source;
                        to = publicKey.toBase58();
                        break;
                      } else if (info?.source === publicKey.toBase58()) {
                        type = type === 'Unknown' ? 'Send' : type;
                        amount = `-${formatSolAmount(info.lamports || 0)} SOL`;
                        from = publicKey.toBase58();
                        to = info.destination;
                        break;
                      }
                    }
                  }
                }
                
                // If we still don't have an amount, set a default based on the fee
                if (!amount) {
                  amount = `-${formatSolAmount(tx.meta.fee || 0)} SOL`;
                }
              }
              
              // Look for token transfers in case this is a token transaction
              if (tx.meta.postTokenBalances && tx.meta.postTokenBalances.length > 0) {
                const tokenBalance = tx.meta.postTokenBalances[0];
                tokenAddress = tokenBalance.mint;
                
                // Set the token type if we have a token transfer
                if (tokenAddress && type === 'Unknown') {
                  type = 'Token ' + (balanceDiff >= 0 ? 'Receive' : 'Send');
                }
              }
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
      toast.error('Αδυναμία φόρτωσης συναλλαγών');
      return [];
    }
  },
  
  // Save transaction to Supabase 
  saveTransaction: async (transaction: Transaction, walletAddress: string, userId?: string): Promise<boolean> => {
    try {
      // Using the database service to save the transaction
      if (userId) {
        return await dbTransactionService.saveTransactionToDatabase(transaction, walletAddress, userId);
      }
      console.log('Saving transaction to database failed: User ID is undefined');
      return false;
    } catch (error) {
      console.error('Error saving transaction:', error);
      return false;
    }
  }
};
