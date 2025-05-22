
import { heliusKeyManager } from './HeliusKeyManager';
import { HELIUS_RPC_URL, HELIUS_API_BASE_URL } from './HeliusConfig';
import { sanitizeErrorObject } from '@/utils/errorTestUtils';
import { toast } from 'sonner';

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
      const sanitizedError = sanitizeErrorObject(error);
      console.error('Failed to initialize HeliusService:', sanitizedError.message);
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
      const sanitizedError = sanitizeErrorObject(error);
      console.error(`Error making Helius API request to ${endpoint}:`, sanitizedError.message);
      throw error;
    }
  }

  async getTokenBalances(address: string) {
    try {
      const response = await this.makeApiRequest('token-balances', { address });
      return response.tokens || [];
    } catch (error) {
      const sanitizedError = sanitizeErrorObject(error);
      console.error('Error fetching token balances:', sanitizedError.message);
      toast.error('Σφάλμα κατά την ανάκτηση υπολοίπων token', {
        description: sanitizedError.message
      });
      return [];
    }
  }

  async getTokenMetadata(addresses: string[]) {
    try {
      const response = await this.makeApiRequest('token-metadata', { mintAccounts: addresses });
      return response || [];
    } catch (error) {
      const sanitizedError = sanitizeErrorObject(error);
      console.error('Error fetching token metadata:', sanitizedError.message);
      toast.error('Σφάλμα κατά την ανάκτηση metadata token', {
        description: sanitizedError.message
      });
      return [];
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
      const sanitizedError = sanitizeErrorObject(error);
      console.error('Error checking API key:', sanitizedError.message);
      return false;
    }
  }

  // Add method to get transaction history
  async getTransactionHistory(walletAddress: string, limit: number = 10) {
    try {
      console.log(`Getting transaction history for wallet: ${walletAddress}`);
      const url = new URL(`${HELIUS_API_BASE_URL}/addresses/${walletAddress}/transactions`);
      
      // Add API key
      const apiKey = this.getApiKey();
      url.searchParams.append('api-key', apiKey);
      
      // Add parameters
      url.searchParams.append('limit', limit.toString());
      
      // Make the request
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      const sanitizedError = sanitizeErrorObject(error);
      console.error("Error fetching transaction history:", sanitizedError.message);
      return [];
    }
  }
}

export const heliusService = new HeliusService();
