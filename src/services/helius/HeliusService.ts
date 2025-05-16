
import { heliusKeyManager } from "./HeliusKeyManager";

// Τυπικές απαντήσεις API του Helius
interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
}

interface TokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  logoURI?: string;
  decimals: number;
}

interface Transaction {
  signature: string;
  type?: string;
  timestamp: string;
  tokenTransfers?: Array<{
    tokenName?: string;
    amount?: number;
    decimals?: number;
  }>;
  nativeTransfers?: Array<{
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }>;
}

class HeliusService {
  private initialized = false;
  private baseUrl = "https://api.helius.xyz/v0";

  constructor() {
    this.initialize();
  }

  public async initialize(): Promise<void> {
    try {
      console.log("Αρχικοποίηση HeliusService...");
      this.initialized = true;
    } catch (error) {
      console.error("Σφάλμα κατά την αρχικοποίηση του HeliusService:", error);
    }
  }

  public async reinitialize(): Promise<void> {
    console.log("Επανεκκίνηση HeliusService...");
    this.initialized = false;
    await this.initialize();
  }

  public async getTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
    try {
      console.log(`Λήψη υπολοίπων token για το πορτοφόλι: ${walletAddress}`);
      // Δημιουργούμε το URL για το API του Helius
      const url = new URL(`${this.baseUrl}/addresses/${walletAddress}/balances`);
      
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

  public async getTokenMetadata(tokenAddresses: string[]): Promise<TokenMetadata[]> {
    try {
      if (!tokenAddresses || tokenAddresses.length === 0) {
        return [];
      }
      
      console.log(`Λήψη μεταδεδομένων για ${tokenAddresses.length} token`);
      // Δημιουργούμε το URL για το API του Helius
      const url = new URL(`${this.baseUrl}/tokens`);
      
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

  public async getTransactionHistory(walletAddress: string, limit: number = 10): Promise<Transaction[]> {
    try {
      console.log(`Λήψη ιστορικού συναλλαγών για το πορτοφόλι: ${walletAddress}`);
      // Δημιουργούμε το URL για το API του Helius
      const url = new URL(`${this.baseUrl}/addresses/${walletAddress}/transactions`);
      
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

  public async checkApiKey(apiKey: string): Promise<boolean> {
    try {
      // Δοκιμάζουμε να κάνουμε ένα απλό αίτημα για να ελέγξουμε αν το κλειδί API είναι έγκυρο
      const url = new URL(`${this.baseUrl}/health-check`);
      url.searchParams.append('api-key', apiKey);
      
      const response = await fetch(url.toString());
      return response.ok;
    } catch (error) {
      console.error("Σφάλμα κατά τον έλεγχο του κλειδιού API:", error);
      return false;
    }
  }
}

// Εξάγουμε ένα μοναδικό instance του HeliusService
export const heliusService = new HeliusService();

// Εξάγουμε την κλάση για χρήση σε άλλα αρχεία
export default HeliusService;
