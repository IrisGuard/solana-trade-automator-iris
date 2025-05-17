
import { FALLBACK_HELIUS_KEY, HELIUS_API_BASE_URL, HELIUS_CONFIG } from './HeliusConfig';
import { heliusKeyManager } from './HeliusKeyManager';
import { toast } from 'sonner';
import { displayError } from '@/utils/error-handling/displayError';

class HeliusService {
  private isInitialized = false;
  private apiKey: string | null = null;
  
  constructor() {
    this.initialize();
  }
  
  /**
   * Initialize the HeliusService
   */
  public async initialize(): Promise<void> {
    try {
      await heliusKeyManager.initialize();
      this.isInitialized = true;
      
      // Pre-fetch API key to have it ready
      this.getApiKey();
    } catch (error) {
      console.error('Error initializing HeliusService:', error);
      this.isInitialized = false;
    }
  }
  
  /**
   * Force reinitialization of the service
   */
  public async reinitialize(): Promise<void> {
    this.isInitialized = false;
    this.apiKey = null;
    await this.initialize();
  }
  
  /**
   * Get a valid API key
   */
  private getApiKey(): string {
    try {
      if (!this.isInitialized) {
        console.warn('HeliusService not initialized, using fallback key');
      }
      
      // Try to get a key from the key manager
      if (heliusKeyManager.hasKeys()) {
        this.apiKey = heliusKeyManager.getApiKey();
        return this.apiKey;
      }
      
      // Fallback to default key if available
      if (FALLBACK_HELIUS_KEY) {
        this.apiKey = FALLBACK_HELIUS_KEY;
        return FALLBACK_HELIUS_KEY;
      }
      
      // Last resort: throw an error
      throw new Error('No Helius API keys available');
    } catch (error) {
      if (!this.apiKey && !FALLBACK_HELIUS_KEY) {
        displayError(error as Error, {
          component: 'HeliusService',
          toastTitle: 'Σφάλμα Helius API',
          details: { method: 'getApiKey' },
          severity: 'high',
          source: 'HeliusService'
        });
        throw new Error('Helius API not configured properly');
      }
      
      // Return whatever key we have, even if it's null
      return this.apiKey || FALLBACK_HELIUS_KEY;
    }
  }
  
  /**
   * Check if an API key is valid
   */
  public async checkApiKey(apiKey: string): Promise<boolean> {
    try {
      const url = `${HELIUS_API_BASE_URL}/addresses/vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg/balances?api-key=${apiKey}`;
      const response = await fetch(url);
      return response.status === 200;
    } catch (error) {
      console.error('Error checking Helius API key:', error);
      return false;
    }
  }
  
  /**
   * Get token balances for an address
   */
  public async getTokenBalances(address: string): Promise<any[]> {
    try {
      const apiKey = this.getApiKey();
      const url = `${HELIUS_API_BASE_URL}/addresses/${address}/balances?api-key=${apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.tokens || [];
    } catch (error) {
      displayError(error as Error, {
        component: 'HeliusService',
        toastTitle: 'Σφάλμα λήψης νομισμάτων',
        details: { address },
        severity: 'medium',
        source: 'HeliusService'
      });
      return [];
    }
  }
  
  /**
   * Get token metadata
   */
  public async getTokenMetadata(addresses: string[]): Promise<any[]> {
    try {
      if (!addresses.length) return [];
      
      const apiKey = this.getApiKey();
      const url = `${HELIUS_API_BASE_URL}/tokens?api-key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mintAccounts: addresses }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.tokens || [];
    } catch (error) {
      displayError(error as Error, {
        component: 'HeliusService',
        toastTitle: 'Σφάλμα λήψης μεταδεδομένων',
        details: { addressCount: addresses.length },
        severity: 'medium',
        source: 'HeliusService'
      });
      return [];
    }
  }
}

// Export a singleton instance
export const heliusService = new HeliusService();
