
import { fetchApiKey } from '@/utils/apiKeyFetcher';

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
      } catch (error) {
        console.error('Failed to fetch Helius API key:', error);
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
}

export const heliusService = new HeliusService();
