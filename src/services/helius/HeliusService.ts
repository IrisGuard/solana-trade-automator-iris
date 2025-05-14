
import { heliusKeyManager } from './HeliusKeyManager';
import { heliusEndpointMonitor } from './HeliusEndpointMonitor';
import { withRateLimitRetry, isRateLimitError } from '@/utils/error-handling/rateLimitHandler';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import { displayError } from '@/utils/error-handling/displayError';

/**
 * Ρυθμίσεις για τα API αιτήματα
 */
const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Χρονικό όριο για τα API αιτήματα (10 δευτερόλεπτα)
 */
const API_TIMEOUT = 10000;

/**
 * Υπηρεσία για την επικοινωνία με το Helius API
 */
export class HeliusService {
  // Τα βασικά endpoints
  private static RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/';
  private static WEBSOCKET_ENDPOINT = 'wss://mainnet.helius-rpc.com/';
  private static ECLIPSE_ENDPOINT = 'https://eclipse.helius-rpc.com/';
  private static API_V0_ENDPOINT = 'https://api.helius.xyz/v0';
  private static TRANSACTIONS_ENDPOINT = 'https://api.helius.xyz/v0/transactions';
  private static ADDRESS_TRANSACTIONS_ENDPOINT = 'https://api.helius.xyz/v0/addresses/{address}/transactions';
  
  /**
   * Αρχικοποίηση των υπηρεσιών Helius
   */
  static async initialize(): Promise<void> {
    try {
      // Αρχικοποίηση του διαχειριστή κλειδιών
      await heliusKeyManager.initialize();
      
      // Αρχικοποίηση του παρακολούθησης endpoints
      await heliusEndpointMonitor.initialize();
      
      console.log(`Helius services initialized with ${heliusKeyManager.getKeyCount()} keys and ${heliusEndpointMonitor.getEndpointCount()} endpoints`);
    } catch (err) {
      displayError('Failed to initialize Helius services', {
        component: 'HeliusService',
        details: err
      });
    }
  }

  /**
   * Επιστρέφει αν η υπηρεσία είναι λειτουργική
   */
  static isOperational(): boolean {
    return heliusEndpointMonitor.isServiceOperational();
  }

  /**
   * Επιστρέφει το τρέχον API κλειδί
   */
  static getApiKey(): string {
    return heliusKeyManager.getCurrentKey();
  }

  /**
   * Επιστρέφει το RPC endpoint με το κλειδί API
   */
  static getRpcEndpoint(): string {
    // Έλεγχος για το καλύτερο διαθέσιμο endpoint
    const bestEndpoint = heliusEndpointMonitor.getBestEndpoint('rpc');
    if (bestEndpoint) {
      return bestEndpoint.url;
    }
    
    // Fallback στο προεπιλεγμένο
    return `${this.RPC_ENDPOINT}?api-key=${this.getApiKey()}`;
  }

  /**
   * Επιστρέφει το WebSocket endpoint με το κλειδί API
   */
  static getWebSocketEndpoint(): string {
    return `${this.WEBSOCKET_ENDPOINT}?api-key=${this.getApiKey()}`;
  }

  /**
   * Επιστρέφει το Eclipse endpoint
   */
  static getEclipseEndpoint(): string {
    return this.ECLIPSE_ENDPOINT;
  }

  /**
   * Επιστρέφει το API V0 endpoint με το κλειδί API
   */
  static getApiV0Endpoint(path: string = ''): string {
    // Έλεγχος για το καλύτερο διαθέσιμο endpoint
    const bestEndpoint = heliusEndpointMonitor.getBestEndpoint('api');
    if (bestEndpoint) {
      const baseUrl = new URL(bestEndpoint.url);
      return `${baseUrl.origin}${path}${baseUrl.search}`;
    }
    
    // Fallback στο προεπιλεγμένο
    const separator = path.includes('?') ? '&' : '?';
    return `${this.API_V0_ENDPOINT}${path}${separator}api-key=${this.getApiKey()}`;
  }

  /**
   * Επιστρέφει το Transactions endpoint με το κλειδί API
   */
  static getTransactionsEndpoint(): string {
    // Έλεγχος για το καλύτερο διαθέσιμο endpoint
    const bestEndpoint = heliusEndpointMonitor.getBestEndpoint('transactions');
    if (bestEndpoint) {
      return bestEndpoint.url;
    }
    
    // Fallback στο προεπιλεγμένο
    return `${this.TRANSACTIONS_ENDPOINT}?api-key=${this.getApiKey()}`;
  }

  /**
   * Επιστρέφει το Address Transactions endpoint με το κλειδί API
   */
  static getAddressTransactionsEndpoint(address: string): string {
    return this.ADDRESS_TRANSACTIONS_ENDPOINT
      .replace('{address}', address) + 
      `?api-key=${this.getApiKey()}`;
  }

  /**
   * Συνάρτηση για την εκτέλεση αιτημάτων προς το Helius API με αυτόματη
   * εναλλαγή κλειδιών σε περίπτωση rate limit
   */
  static async fetchFromHelius(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      // Χρήση του μηχανισμού επανάληψης σε περίπτωση rate limit
      return await withRateLimitRetry(async () => {
        const response = await fetch(endpoint, {
          headers: API_HEADERS,
          ...options,
          signal: AbortSignal.timeout(API_TIMEOUT)
        });

        if (!response.ok) {
          throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
        }

        // Σημείωση επιτυχημένης κλήσης
        heliusKeyManager.markKeyAsSuccessful();

        return await response.json();
      }, { endpoint: `helius-${endpoint.substring(0, 30)}` });
    } catch (error) {
      // Αν είναι σφάλμα rate limit, δοκιμάζουμε με νέο κλειδί
      if (isRateLimitError(error)) {
        // Εναλλαγή κλειδιού
        const newKey = heliusKeyManager.rotateKey();
        
        // Αντικατάσταση του κλειδιού στο endpoint
        const updatedEndpoint = endpoint.replace(/api-key=[^&]+/, `api-key=${newKey}`);
        
        try {
          // Επανάληψη με νέο κλειδί
          console.log("Retrying with different Helius API key");
          const response = await fetch(updatedEndpoint, {
            headers: API_HEADERS,
            ...options,
            signal: AbortSignal.timeout(API_TIMEOUT)
          });
          
          if (!response.ok) {
            throw new Error(`Helius API error after key rotation: ${response.status} ${response.statusText}`);
          }
          
          // Σημείωση επιτυχημένης κλήσης με το νέο κλειδί
          heliusKeyManager.markKeyAsSuccessful();
          
          return await response.json();
        } catch (retryError) {
          // Σε περίπτωση νέου σφάλματος, εμφάνιση τοστ και καταγραφή
          console.error('Error after key rotation:', retryError);
          errorCollector.captureError(retryError instanceof Error ? retryError : new Error('Helius API error after key rotation'), {
            component: 'HeliusService',
            source: 'client'
          });
          throw retryError;
        }
      }
      
      // Για μη rate limit σφάλματα, απλά προώθησή τους
      console.error('Error fetching from Helius:', error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Error fetching from Helius'), {
        component: 'HeliusService',
        source: 'client'
      });
      throw error;
    }
  }

  /**
   * Λήψη συναλλαγών για μια διεύθυνση
   */
  static async getAddressTransactions(address: string, limit = 10): Promise<any> {
    try {
      const endpoint = this.getAddressTransactionsEndpoint(address) + `&limit=${limit}`;
      return await this.fetchFromHelius(endpoint);
    } catch (error) {
      console.error('Error fetching address transactions:', error);
      throw error;
    }
  }

  /**
   * Λήψη συναλλαγής από υπογραφή
   */
  static async getTransaction(signature: string): Promise<any> {
    try {
      const endpoint = this.getTransactionsEndpoint() + `&signatures[]=${signature}`;
      return await this.fetchFromHelius(endpoint);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  /**
   * Έλεγχος κατάστασης των κλειδιών και endpoints
   */
  static async checkStatus(): Promise<{
    isOperational: boolean;
    keyCount: number;
    workingKeyCount: number;
    endpointCount: number;
    activeEndpointCount: number;
  }> {
    await this.initialize();
    
    return {
      isOperational: this.isOperational(),
      keyCount: heliusKeyManager.getKeyCount(),
      workingKeyCount: heliusKeyManager.getWorkingKeyCount(),
      endpointCount: heliusEndpointMonitor.getEndpointCount(),
      activeEndpointCount: heliusEndpointMonitor.getActiveEndpointCount()
    };
  }

  /**
   * Επαναφόρτωση των κλειδιών και endpoints από το Supabase
   */
  static async refreshConfiguration(): Promise<void> {
    try {
      await heliusKeyManager.forceReload();
      await heliusEndpointMonitor.forceReload();
      toast.success("Η διαμόρφωση Helius ενημερώθηκε επιτυχώς");
    } catch (error) {
      displayError('Error refreshing Helius configuration', {
        component: 'HeliusService',
        details: error
      });
    }
  }
}

// Αυτόματη αρχικοποίηση κατά την εισαγωγή
HeliusService.initialize().catch(err => {
  displayError('Failed to initialize HeliusService', {
    component: 'HeliusService',
    details: err
  });
});
