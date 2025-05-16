
import { errorCollector } from '@/utils/error-handling/collector';
import { heliusKeyManager } from './HeliusKeyManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

class HeliusService {
  private baseUrl = 'https://api.helius.xyz/v0';
  private currentEndpoint = 0;
  private endpoints = ['mainnet-beta', 'devnet'];
  private apiKeyStatus = false;
  private retryCount = 0;
  private maxRetries = 3;
  private initialized = false;

  constructor() {
    console.log('HeliusService initialized');
    // Check API key when service initializes
    this.initialize();
  }
  
  public async initialize() {
    try {
      console.log('Initializing HeliusService');
      // First ensure heliusKeyManager is initialized
      if (heliusKeyManager && !heliusKeyManager.isInitialized()) {
        await heliusKeyManager.initialize();
      }
      
      const apiKey = this.getApiKey();
      if (apiKey) {
        this.apiKeyStatus = await this.checkApiKey(apiKey);
        console.log('Helius API key status:', this.apiKeyStatus ? 'valid' : 'invalid');
        
        if (this.apiKeyStatus) {
          console.log('Helius service successfully initialized with valid API key');
          this.initialized = true;
        } else {
          console.warn('Helius API key invalid or unreachable');
          this.reportError(new Error('Invalid Helius API key during initialization'));
        }
      } else {
        console.warn('No Helius API key available during initialization');
      }
    } catch (error) {
      console.error('Error initializing HeliusService:', error);
      this.reportError(new Error(`Failed to initialize HeliusService: ${error}`));
    }
  }
  
  // This method will be called by syncHeliusKeys to reinitialize the service
  public async reinitialize() {
    try {
      console.log('Reinitializing HeliusService');
      // Reset state
      this.apiKeyStatus = false;
      this.retryCount = 0;
      this.initialized = false;
      
      // Reinitialize
      await this.initialize();
      
      // Test the connection with a lightweight API call
      const isConnected = await this.testConnection();
      if (isConnected) {
        toast.success('Επιτυχής σύνδεση με το Helius API');
        return true;
      } else {
        toast.error('Αποτυχία σύνδεσης με το Helius API');
        return false;
      }
    } catch (error) {
      console.error('Error reinitializing HeliusService:', error);
      this.reportError(new Error(`Failed to reinitialize HeliusService: ${error}`));
      return false;
    }
  }
  
  // Simple test connection method
  private async testConnection(): Promise<boolean> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) return false;
      
      // Use the status endpoint to verify connection
      const url = `${this.baseUrl}/status?api-key=${apiKey}`;
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      console.error('Error testing Helius connection:', error);
      return false;
    }
  }

  public async getTokenBalances(address: string): Promise<any[]> {
    try {
      // Ensure initialized
      if (!this.initialized) {
        await this.initialize();
      }
      
      this.retryCount = 0;
      return await this.fetchTokenBalancesWithRetry(address);
    } catch (error) {
      this.reportError(new Error(`Final failure to get token balances: ${error}`));
      console.error('All retries failed when fetching token balances:', error);
      
      // Show toast to user when token loading fails
      toast.error('Αποτυχία φόρτωσης tokens', {
        description: 'Προσπαθήστε να συγχρονίσετε ξανά το κλειδί Helius',
        action: {
          label: 'Συγχρονισμός',
          onClick: () => {
            this.reinitialize();
          }
        }
      });
      
      return [];
    }
  }
  
  private async fetchTokenBalancesWithRetry(address: string): Promise<any[]> {
    try {
      const apiKey = this.getApiKey();
      
      if (!apiKey) {
        console.log('Missing API key for Helius call');
        toast.error('Λείπει το κλειδί API Helius', {
          description: 'Παρακαλούμε προσθέστε ένα κλειδί API Helius στο API Vault',
          duration: 5000
        });
        return [];
      }
      
      if (!address) {
        console.log('Missing address for Helius call');
        return [];
      }
      
      console.log(`Fetching token balances for address: ${address} with API key: ${apiKey.substring(0, 8)}...`);
      
      const url = `${this.baseUrl}/token-balances?api-key=${apiKey}&address=${address}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Helius API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Received token data for ${address}:`, data);
      
      // Return empty array if no tokens property
      if (!data.tokens) {
        console.log('No tokens property in response');
        return [];
      }
      
      return data.tokens || [];
    } catch (error) {
      // Handle retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retry attempt ${this.retryCount} for token balances...`);
        this.rotateEndpoint();
        // Add exponential backoff delay
        const delay = Math.pow(2, this.retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchTokenBalancesWithRetry(address);
      }
      
      this.reportError(new Error(`Failed to get token balances: ${error}`));
      console.error('Error fetching token balances:', error);
      return [];
    }
  }

  public async getTransactionHistory(address: string): Promise<any[]> {
    try {
      const apiKey = this.getApiKey();
      
      if (!apiKey || !address) {
        console.log('Missing API key or address for Helius call');
        return [];
      }
      
      const url = `${this.baseUrl}/addresses/${address}/transactions?api-key=${apiKey}&limit=20`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Retrieved ${data?.length || 0} transactions for address: ${address}`);
      return data || [];
    } catch (error) {
      this.reportError(new Error(`Failed to get transaction history: ${error}`));
      return [];
    }
  }

  public async getTokenMetadata(mintAddresses: string[]): Promise<any[]> {
    try {
      if (!mintAddresses || mintAddresses.length === 0) {
        console.log('No mint addresses provided for token metadata');
        return [];
      }
      
      const apiKey = this.getApiKey();
      
      if (!apiKey) {
        console.log('Missing API key for Helius call');
        return [];
      }
      
      console.log(`Fetching metadata for ${mintAddresses.length} tokens`);
      
      const url = `${this.baseUrl}/token-metadata?api-key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mintAccounts: mintAddresses }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Helius API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Received metadata for ${mintAddresses.length} tokens:`, data);
      
      return data || [];
    } catch (error) {
      this.reportError(new Error(`Failed to get token metadata: ${error}`));
      console.error('Error fetching token metadata:', error);
      return [];
    }
  }
  
  // Get enriched transaction history with more details
  public async getEnrichedTransactions(address: string): Promise<any[]> {
    try {
      const apiKey = this.getApiKey();
      
      if (!apiKey || !address) {
        console.log('Missing API key or address for Helius enriched transactions call');
        return [];
      }
      
      const url = `${this.baseUrl}/addresses/${address}/enriched-transactions?api-key=${apiKey}&limit=20`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Retrieved ${data?.length || 0} enriched transactions`);
      return data || [];
    } catch (error) {
      this.reportError(new Error(`Failed to get enriched transactions: ${error}`));
      return [];
    }
  }

  private getApiKey(): string {
    if (!heliusKeyManager) {
      this.reportError(new Error('HeliusKeyManager is not initialized'));
      return '';
    }
    
    try {
      // Debug log the key count
      const keyCount = heliusKeyManager.getKeyCount();
      console.log(`HeliusKeyManager has ${keyCount} API keys`);
      
      // Get the key from HeliusKeyManager
      const apiKey = heliusKeyManager.getApiKey();
      if (!apiKey) {
        this.reportError(new Error('HeliusKeyManager returned empty API key'));
        console.log('Attempting to use default key');
        return "ddb32813-1f4b-459d-8964-310b1b73a053"; // Default key as fallback
      }
      
      // Avoid logging full API key for security, just log first few characters
      console.log(`Retrieved API key: ${apiKey.substring(0, 8)}...`);
      return apiKey;
    } catch (error) {
      console.error('Error getting API key:', error);
      this.reportError(new Error(`Failed to get API key: ${error}`));
      return "ddb32813-1f4b-459d-8964-310b1b73a053"; // Default key as fallback
    }
  }

  private getEndpoint(): string {
    return this.endpoints[this.currentEndpoint];
  }

  private rotateEndpoint(): void {
    this.currentEndpoint = (this.currentEndpoint + 1) % this.endpoints.length;
    console.log(`Rotating to endpoint: ${this.getEndpoint()}`);
  }

  private reportError(error: Error): void {
    errorCollector.captureError(error, {
      component: 'HeliusService',
      source: 'api',
      severity: 'medium'
    });
  }
  
  // Helper method to check API key validity
  public async checkApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Checking Helius API key validity...');
      const url = `${this.baseUrl}/status?api-key=${apiKey}`;
      
      const response = await fetch(url);
      const isValid = response.ok;
      
      console.log(`Helius API key check result: ${isValid ? 'valid' : 'invalid'}`);
      return isValid;
    } catch (error) {
      console.error('Error checking Helius API key:', error);
      return false;
    }
  }
}

export const heliusService = new HeliusService();
