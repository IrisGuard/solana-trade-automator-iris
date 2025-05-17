
import { heliusKeyManager } from "./HeliusKeyManager";
import { TokenBalance, TokenMetadata } from "./types";
import { HELIUS_API_BASE_URL } from "./HeliusConfig";

/**
 * Service for token-related Helius API operations
 */
export class TokenService {
  /**
   * Get token balances for a wallet address
   */
  public async getTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
    try {
      console.log(`Λήψη υπολοίπων token για το πορτοφόλι: ${walletAddress}`);
      // Δημιουργούμε το URL για το API του Helius
      const url = new URL(`${HELIUS_API_BASE_URL}/addresses/${walletAddress}/balances`);
      
      // Προσθέτουμε το API key
      const apiKey = heliusKeyManager.getApiKey();
      console.log(`Χρήση API key: ${apiKey.substring(0, 8)}... για τη λήψη υπολοίπων token`);
      url.searchParams.append('api-key', apiKey);
      
      // Κάνουμε το αίτημα
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Σφάλμα API Helius: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Ελήφθησαν ${data.tokens?.length || 0} token από το Helius API`);
      return data.tokens || [];
    } catch (error) {
      console.error("Σφάλμα κατά τη λήψη υπολοίπων token:", error);
      return [];
    }
  }

  /**
   * Get token metadata for specified token addresses
   */
  public async getTokenMetadata(tokenAddresses: string[]): Promise<TokenMetadata[]> {
    try {
      if (!tokenAddresses || tokenAddresses.length === 0) {
        return [];
      }
      
      console.log(`Λήψη μεταδεδομένων για ${tokenAddresses.length} token`);
      // Δημιουργούμε το URL για το API του Helius
      const url = new URL(`${HELIUS_API_BASE_URL}/tokens`);
      
      // Προσθέτουμε το API key
      const apiKey = heliusKeyManager.getApiKey();
      url.searchParams.append('api-key', apiKey);
      
      // Προσθέτουμε τις διευθύνσεις των token
      url.searchParams.append('mints', tokenAddresses.join(','));
      
      // Κάνουμε το αίτημα
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Σφάλμα API Helius: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Ελήφθησαν μεταδεδομένα για ${data.length || 0} token`);
      return data || [];
    } catch (error) {
      console.error("Σφάλμα κατά τη λήψη μεταδεδομένων token:", error);
      return [];
    }
  }
}

// Export a singleton instance
export const tokenService = new TokenService();
