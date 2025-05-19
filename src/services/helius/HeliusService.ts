
import { fetchApiKey } from '@/utils/apiKeyFetcher';

// Add a fallback key config
const FALLBACK_HELIUS_KEY = null; // No hardcoded keys - will be populated from database

class HeliusService {
  private baseUrl = 'https://api.helius.xyz/v0';
  private apiKey: string | null = null;
  
  constructor() {
    // Don't load API key in constructor, load it lazily when needed
    console.log('HeliusService initialized');
  }
  
  private async getApiKey(): Promise<string> {
    if (!this.apiKey) {
      try {
        this.apiKey = await fetchApiKey('helius');
        console.log('Helius API key loaded successfully');
      } catch (error) {
        console.error('Failed to fetch Helius API key:', error);
        if (!this.apiKey && FALLBACK_HELIUS_KEY) {
          console.warn('Using fallback Helius API key');
          this.apiKey = FALLBACK_HELIUS_KEY;
        }
      }
    }
    
    if (!this.apiKey) {
      throw new Error('No Helius API key available');
    }
    
    return this.apiKey;
  }
  
  // Check if an API key is valid
  async checkApiKey(apiKey: string): Promise<boolean> {
    try {
      // Try a simple request to check if the API key is valid
      const testUrl = `${this.baseUrl}/addresses/dominated?api-key=${apiKey}`;
      
      const response = await fetch(testUrl);
      
      // If we get a 401 or 403, the API key is invalid
      if (response.status === 401 || response.status === 403) {
        return false;
      }
      
      // Any successful response means the key is working
      return response.ok;
    } catch (error) {
      console.error('Error testing Helius API key:', error);
      return false;
    }
  }
  
  // Get account information
  async getAccountInfo(address: string): Promise<any> {
    try {
      const apiKey = await this.getApiKey();
      const url = `${this.baseUrl}/addresses/${address}/balances?api-key=${apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch account info: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching account info from Helius:', error);
      throw error;
    }
  }
  
  // Get token balances for an address
  async getTokenBalances(address: string): Promise<any> {
    try {
      const apiKey = await this.getApiKey();
      const url = `${this.baseUrl}/addresses/${address}/balances?api-key=${apiKey}`;
      
      console.log(`Fetching token balances from Helius for address: ${address}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token balances: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Received token balances from Helius: ${data ? data.length : 0} tokens`);
      return data;
    } catch (error) {
      console.error('Error fetching token balances from Helius:', error);
      throw error;
    }
  }
  
  // Get token metadata
  async getTokenMetadata(mintAddresses: string[]): Promise<any> {
    try {
      if (!mintAddresses || mintAddresses.length === 0) {
        return [];
      }
      
      const apiKey = await this.getApiKey();
      const url = `${this.baseUrl}/tokens/metadata?api-key=${apiKey}`;
      
      console.log(`Fetching metadata for ${mintAddresses.length} tokens from Helius`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mintAccounts: mintAddresses }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token metadata: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Received metadata for ${data ? data.length : 0} tokens from Helius`);
      return data;
    } catch (error) {
      console.error('Error fetching token metadata from Helius:', error);
      throw error;
    }
  }
  
  // Get transaction history for an address
  async getTransactionHistory(address: string, limit = 10, offset = 0): Promise<any> {
    try {
      const apiKey = await this.getApiKey();
      const url = `${this.baseUrl}/addresses/${address}/transactions?api-key=${apiKey}&limit=${limit}&before=${offset}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction history: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction history from Helius:', error);
      throw error;
    }
  }
  
  // Reinitialize the service (for example, after adding a new key)
  reinitialize(): void {
    this.apiKey = null;
    console.log('HeliusService reinitialized');
  }
}

export const heliusService = new HeliusService();
