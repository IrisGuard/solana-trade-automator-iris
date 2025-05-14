
import { API_ENDPOINTS, API_KEYS } from './config';
import { API_HEADERS, API_TIMEOUT } from './apiConfig';

export class HeliusService {
  static getBaseUrl(): string {
    return API_ENDPOINTS.HELIUS_API;
  }

  static getApiKey(): string {
    return API_KEYS.HELIUS;
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

  // Βοηθητική μέθοδος για κλήσεις Fetch
  static async fetchFromHelius(endpoint: string, options = {}): Promise<any> {
    try {
      const response = await fetch(endpoint, {
        headers: API_HEADERS,
        ...options,
        signal: AbortSignal.timeout(API_TIMEOUT)
      });

      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
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
