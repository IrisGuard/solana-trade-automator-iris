
import { Connection, PublicKey } from "@solana/web3.js";
import { RPC_ENDPOINTS } from "../config";
import { withRateLimitRetry } from "@/utils/error-handling/rateLimitHandler";
import { parseTransaction, type ParsedTransaction } from "./parseTransaction";

// Fetch transactions for an address using the Solana connection
export async function fetchTransactionsByAddress(
  address: string,
  limit: number = 10
): Promise<ParsedTransaction[]> {
  try {
    // Fixed: Changed RPC_ENDPOINTS.PRIMARY to RPC_ENDPOINTS.MAINNET
    const connection = new Connection(RPC_ENDPOINTS.MAINNET);
    const publicKey = new PublicKey(address);
    
    // Fetch raw transactions with options
    const fetchRawTransactions = async () => {
      // Get signatures for the address
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit,
      });
      
      // Get transaction details for each signature
      const transactions = await Promise.all(
        signatures.map(sig => connection.getTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        }))
      );
      
      return transactions.filter(Boolean); // Filter out null/undefined transactions
    };
    
    // Fetch transactions with retry logic for rate limits
    const rawTransactions = await withRateLimitRetry(fetchRawTransactions, { 
      endpoint: 'solana-fetch-transactions',
      maxRetries: 3 
    });
    
    // Parse the transactions into a standardized format
    const parsedTransactions = rawTransactions.map(tx => parseTransaction(tx));
    
    return parsedTransactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
