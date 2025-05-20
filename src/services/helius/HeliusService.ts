
import { heliusKeyManager } from './HeliusKeyManager';
import { HELIUS_RPC_URL } from './HeliusConfig';

class HeliusService {
  private initialized = false;

  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      // Initialize key manager
      await heliusKeyManager.initialize();
      this.initialized = true;
      console.log('HeliusService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize HeliusService:', error);
      this.initialized = false;
    }
  }

  async reinitialize() {
    this.initialized = false;
    await this.initialize();
  }

  private getApiKey() {
    return heliusKeyManager.getApiKey();
  }

  private async makeApiRequest(endpoint: string, params: any = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    const apiKey = this.getApiKey();
    
    try {
      const response = await fetch(`${HELIUS_RPC_URL}/${endpoint}?api-key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error making Helius API request to ${endpoint}:`, error);
      throw error;
    }
  }

  async getTokenBalances(address: string) {
    try {
      const response = await this.makeApiRequest('token-balances', { address });
      return response.tokens || [];
    } catch (error) {
      console.error('Error fetching token balances:', error);
      throw error;
    }
  }

  async getTokenMetadata(addresses: string[]) {
    try {
      const response = await this.makeApiRequest('token-metadata', { mintAccounts: addresses });
      return response || [];
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  }

  // Check if an API key is valid
  async checkApiKey(apiKey: string): Promise<boolean> {
    try {
      // Use a test address to check if the API key works
      const testAddress = '5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8';
      
      const response = await fetch(`${HELIUS_RPC_URL}/token-balances?api-key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: testAddress }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error checking API key:', error);
      return false;
    }
  }
}

export const heliusService = new HeliusService();
