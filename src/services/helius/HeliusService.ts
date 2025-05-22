
import { heliusKeyManager } from './HeliusKeyManager';
import { HELIUS_RPC_URL, HELIUS_API_BASE_URL } from './HeliusConfig';
import { sanitizeErrorObject } from '@/utils/errorTestUtils';
import { toast } from 'sonner';

class HeliusService {
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.initialize();
  }

  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = new Promise<void>(async (resolve) => {
      try {
        // Initialize key manager
        await heliusKeyManager.initialize();
        this.initialized = true;
        console.log('HeliusService initialized successfully');
      } catch (error) {
        const sanitizedError = sanitizeErrorObject(error);
        console.error('Failed to initialize HeliusService:', sanitizedError.message);
        this.initialized = false;
      } finally {
        resolve();
      }
    });
    
    return this.initializationPromise;
  }

  async reinitialize() {
    this.initialized = false;
    this.initializationPromise = null;
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
      
      // Check if this might be an API key issue and try to refresh keys
      if (sanitizedError.message?.includes('401') || 
          sanitizedError.message?.includes('403') || 
          sanitizedError.message?.includes('Authentication')) {
        console.log('Potential API key issue, attempting to refresh keys');
        await heliusKeyManager.forceReload();
      }
      
      throw error;
    }
  }
  
  /**
   * Check if an API key is valid
   */
  async checkApiKey(apiKey: string): Promise<boolean> {
    try {
      // Use a test address to check if the API key works
      const testAddress = "5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8";
      
      const response = await fetch(`${HELIUS_RPC_URL}/v0/addresses/${testAddress}/balances?api-key=${apiKey}`);
      
      return response.ok;
    } catch (error) {
      console.error('Error checking API key:', error);
      return false;
    }
  }
  
  /**
   * Get token balances for a wallet address
   */
  async getTokenBalances(walletAddress: string) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      return await this.makeApiRequest(`v0/addresses/${walletAddress}/balances`, {});
    } catch (error) {
      const sanitizedError = sanitizeErrorObject(error);
      console.error('Error getting token balances:', sanitizedError.message);
      throw error;
    }
  }
}

// Export a singleton instance
export const heliusService = new HeliusService();
