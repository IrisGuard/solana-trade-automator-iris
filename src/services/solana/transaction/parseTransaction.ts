
import { ParsedTransactionWithMeta, PartiallyDecodedInstruction, PublicKey } from '@solana/web3.js';
import { Transaction } from '@/types/wallet';
import { determineTransactionType, formatSolAmount, hasGetAccountKeysMethod } from './utils';
import { MessageWithAccountKeys, ParsedInstruction } from './types';

/**
 * Extract transaction data from a parsed transaction
 */
export function parseTransaction(
  tx: ParsedTransactionWithMeta,
  signature: string,
  timestamp: number,
  userPublicKey: PublicKey
): Transaction {
  let type = 'Unknown';
  let status = tx.meta?.err ? 'Failed' : 'Success';
  let amount: string | undefined;
  let from: string | undefined;
  let to: string | undefined;
  let tokenAddress: string | undefined;
  
  // Check if transaction has message and instructions
  if (tx.transaction?.message) {
    const message: MessageWithAccountKeys = tx.transaction.message;
    
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
      if (accountKey === userPublicKey.toBase58()) {
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
          
          from = userPublicKey.toBase58();
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
          
          to = userPublicKey.toBase58();
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
              if (info?.destination === userPublicKey.toBase58()) {
                type = type === 'Unknown' ? 'Receive' : type;
                amount = `+${formatSolAmount(info.lamports || 0)} SOL`;
                from = info.source;
                to = userPublicKey.toBase58();
                break;
              } else if (info?.source === userPublicKey.toBase58()) {
                type = type === 'Unknown' ? 'Send' : type;
                amount = `-${formatSolAmount(info.lamports || 0)} SOL`;
                from = userPublicKey.toBase58();
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
}
