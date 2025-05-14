
import { API_ENDPOINTS } from './config';
import { API_HEADERS, API_TIMEOUT } from './apiConfig';
import { heliusKeyManager } from './HeliusKeyManager';
import { withRateLimitRetry, isRateLimitError } from '@/utils/error-handling/rateLimitHandler';
import { toast } from 'sonner';

export class HeliusService {
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

  static getRpcEndpoint(): string {
    return `https://mainnet.helius-rpc.com/?api-key=${this.getApiKey()}`;
  }

  static getWebSocketEndpoint(): string {
    return `wss://mainnet.helius-rpc.com/?api-key=${this.getApiKey()}`;
  }

  static getEclipseEndpoint(): string {
    return 'https://eclipse.helius-rpc.com/';
  }

  // Endpoints για συγκεκριμένες λειτουργίες
  static endpoints = {
    getTransactions: () => this.getEndpoint('/transactions/'),
    getAddressTransactions: (address: string) => this.getEndpoint(`/addresses/${address}/transactions/`),
    getTransactionsBySignatures: () => this.getEndpoint('/transactions/')
  };

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

  // Παράδειγμα μεθόδου για λήψη των συναλλαγών διεύθυνσης
  static async getAddressTransactions(address: string, limit = 10): Promise<any> {
    const endpoint = this.endpoints.getAddressTransactions(address) + `&limit=${limit}`;
    return this.fetchFromHelius(endpoint);
  }

  // Μέθοδος για λήψη συναλλαγής από signature
  static async getTransaction(signature: string): Promise<any> {
    const endpoint = this.endpoints.getTransactions() + `&signatures[]=${signature}`;
    return this.fetchFromHelius(endpoint);
  }
}

// Initialize the key manager when the service is imported
HeliusService.initialize().catch(err => {
  console.error("Failed to initialize HeliusService:", err);
});
