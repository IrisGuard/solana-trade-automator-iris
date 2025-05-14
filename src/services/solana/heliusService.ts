
import { API_ENDPOINTS } from './config';
import { API_HEADERS, API_TIMEOUT } from './apiConfig';
import { heliusKeyManager } from './HeliusKeyManager';
import { withRateLimitRetry, isRateLimitError } from '@/utils/error-handling/rateLimitHandler';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';

export class HeliusService {
  // Special endpoints to use
  private static API_V0_ENDPOINT = 'https://api.helius.xyz/v0';
  private static ECLIPSE_ENDPOINT = 'https://eclipse.helius-rpc.com/';
  
  // Initialize the key manager when the service is first used
  static async initialize(): Promise<void> {
    await heliusKeyManager.initialize();
  }

  static getBaseUrl(): string {
    return API_ENDPOINTS.HELIUS_API;
  }

  static getApiKey(): string {
    return heliusKeyManager.getCurrentKey();
  }

  static getEndpoint(path: string): string {
    const baseUrl = this.getBaseUrl();
    const apiKey = this.getApiKey();
    const separator = path.includes('?') ? '&' : '?';
    return `${baseUrl}${path}${separator}api-key=${apiKey}`;
  }

  // Get V0 API endpoint (alternative API format)
  static getV0Endpoint(path: string): string {
    const apiKey = this.getApiKey();
    const separator = path.includes('?') ? '&' : '?';
    return `${this.API_V0_ENDPOINT}${path}${separator}api-key=${apiKey}`;
  }

  static getRpcEndpoint(): string {
    return `https://mainnet.helius-rpc.com/?api-key=${this.getApiKey()}`;
  }

  static getWebSocketEndpoint(): string {
    return `wss://mainnet.helius-rpc.com/?api-key=${this.getApiKey()}`;
  }

  static getEclipseEndpoint(): string {
    return this.ECLIPSE_ENDPOINT;
  }

  // Endpoints για συγκεκριμένες λειτουργίες
  static endpoints = {
    // V0 API endpoints (alternative format)
    v0: {
      getTransactions: () => this.getV0Endpoint('/transactions'),
      getAddressTransactions: (address: string) => this.getV0Endpoint(`/addresses/${address}/transactions`)
    },
    // Legacy API endpoints
    getTransactions: () => this.getEndpoint('/transactions/'),
    getAddressTransactions: (address: string) => this.getEndpoint(`/addresses/${address}/transactions/`),
    getTransactionsBySignatures: () => this.getEndpoint('/transactions/')
  };

  // Try multiple endpoints for the same data to maximize success rate
  private static async tryMultipleEndpoints<T>(
    primaryFn: () => Promise<T>,
    backupFn: () => Promise<T>,
    options: { endpoint: string }
  ): Promise<T> {
    try {
      // First try with the primary endpoint
      return await withRateLimitRetry(primaryFn, options);
    } catch (error) {
      // Log the error from primary endpoint
      console.warn(`Primary endpoint failed for ${options.endpoint}:`, error);
      
      // Only try backup if primary failed due to rate limit
      if (isRateLimitError(error)) {
        console.log(`Trying backup endpoint for ${options.endpoint}`);
        try {
          return await backupFn();
        } catch (backupError) {
          console.error(`Backup endpoint also failed for ${options.endpoint}:`, backupError);
          errorCollector.captureError(backupError, {
            component: 'HeliusService',
            method: options.endpoint,
            details: 'Backup endpoint failed'
          });
          throw backupError;
        }
      }
      
      // For non-rate limit errors, just throw the original error
      throw error;
    }
  }

  // Βοηθητική μέθοδος για κλήσεις Fetch με αυτόματη εναλλαγή κλειδιών σε περίπτωση rate limit
  static async fetchFromHelius(endpoint: string, options = {}): Promise<any> {
    try {
      // Try with current key using rate limit retry mechanism
      return await withRateLimitRetry(async () => {
        const response = await fetch(endpoint, {
          headers: API_HEADERS,
          ...options,
          signal: AbortSignal.timeout(API_TIMEOUT)
        });

        if (!response.ok) {
          throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      }, { endpoint: `helius-${endpoint.substring(0, 30)}` });
    } catch (error) {
      // If rate limit error, try rotating the key and try again
      if (isRateLimitError(error)) {
        // Rotate to next key
        const newKey = heliusKeyManager.rotateKey();
        
        // Replace the API key in the endpoint
        const updatedEndpoint = endpoint.replace(/api-key=[^&]+/, `api-key=${newKey}`);
        
        try {
          // Retry with new key
          console.log("Retrying with different Helius API key");
          return await fetch(updatedEndpoint, {
            headers: API_HEADERS,
            ...options,
            signal: AbortSignal.timeout(API_TIMEOUT)
          }).then(res => {
            if (!res.ok) {
              throw new Error(`Helius API error after key rotation: ${res.status} ${res.statusText}`);
            }
            return res.json();
          });
        } catch (retryError) {
          console.error('Error after key rotation:', retryError);
          throw retryError;
        }
      }
      
      // For non-rate limit errors, just throw the error
      console.error('Error fetching from Helius:', error);
      throw error;
    }
  }

  // Παράδειγμα μεθόδου για λήψη των συναλλαγών διεύθυνσης με πολλαπλές προσπάθειες
  static async getAddressTransactions(address: string, limit = 10): Promise<any> {
    return this.tryMultipleEndpoints(
      // Primary endpoint - standard API
      () => this.fetchFromHelius(this.endpoints.getAddressTransactions(address) + `&limit=${limit}`),
      // Backup endpoint - V0 API (alternative format)
      () => this.fetchFromHelius(this.endpoints.v0.getAddressTransactions(address) + `&limit=${limit}`),
      { endpoint: `address-transactions-${address.substring(0, 8)}` }
    );
  }

  // Μέθοδος για λήψη συναλλαγής από signature με πολλαπλές προσπάθειες
  static async getTransaction(signature: string): Promise<any> {
    return this.tryMultipleEndpoints(
      // Primary endpoint - standard API
      () => this.fetchFromHelius(this.endpoints.getTransactions() + `&signatures[]=${signature}`),
      // Backup endpoint - V0 API
      () => this.fetchFromHelius(this.endpoints.v0.getTransactions() + `&signatures[]=${signature}`),
      { endpoint: `transaction-${signature.substring(0, 8)}` }
    );
  }
}

// Initialize the key manager when the service is imported
HeliusService.initialize().catch(err => {
  console.error("Failed to initialize HeliusService:", err);
  errorCollector.captureError(err, {
    component: 'HeliusService',
    method: 'initialize',
    details: 'Failed during service import'
  });
});
