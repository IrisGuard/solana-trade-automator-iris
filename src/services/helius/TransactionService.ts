
import { heliusKeyManager } from "./HeliusKeyManager";
import { Transaction } from "./types";
import { HELIUS_BASE_URL } from "./HeliusConfig";

/**
 * Service for transaction-related Helius API operations
 */
export class TransactionService {
  /**
   * Get transaction history for a wallet address
   */
  public async getTransactionHistory(walletAddress: string, limit: number = 10): Promise<Transaction[]> {
    try {
      console.log(`Λήψη ιστορικού συναλλαγών για το πορτοφόλι: ${walletAddress}`);
      // Δημιουργούμε το URL για το API του Helius
      const url = new URL(`${HELIUS_BASE_URL}/addresses/${walletAddress}/transactions`);
      
      // Προσθέτουμε το API key
      const apiKey = heliusKeyManager.getApiKey();
      console.log(`Χρήση API key: ${apiKey.substring(0, 8)}... για τη λήψη συναλλαγών`);
      url.searchParams.append('api-key', apiKey);
      
      // Προσθέτουμε παραμέτρους
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('type', 'ALL');
      
      // Κάνουμε το αίτημα
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Σφάλμα API Helius: ${response.status} - ${await response.text()}`);
      }
      
      const data = await response.json();
      console.log(`Ελήφθησαν ${data.length || 0} συναλλαγές από το Helius API`);
      return data || [];
    } catch (error) {
      console.error("Σφάλμα κατά τη λήψη ιστορικού συναλλαγών:", error);
      return [];
    }
  }
}

// Export a singleton instance
export const transactionService = new TransactionService();
