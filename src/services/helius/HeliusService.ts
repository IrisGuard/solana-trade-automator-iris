
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

  constructor() {
    console.log('HeliusService initialized');
    // Check API key when service initializes
    this.checkApiKeyStatus();
  }
  
  private async checkApiKeyStatus() {
    const apiKey = this.getApiKey();
    if (apiKey) {
      this.apiKeyStatus = await this.checkApiKey(apiKey);
      console.log('Helius API key status:', this.apiKeyStatus ? 'valid' : 'invalid');
    }
  }

  public async getTokenBalances(address: string): Promise<any[]> {
    try {
      this.retryCount = 0;
      return await this.fetchTokenBalancesWithRetry(address);
    } catch (error) {
      this.reportError(new Error(`Final failure to get token balances: ${error}`));
      console.error('All retries failed when fetching token balances:', error);
      return [];
    }
  }
  
  private async fetchTokenBalancesWithRetry(address: string): Promise<any[]> {
    try {
      const apiKey = this.getApiKey();
      
      if (!apiKey) {
        console.log('Missing API key for Helius call');
        toast.error('Λείπει το κλειδί API Helius', {
          description: 'Παρακαλούμε προσθέστε ένα κλειδί API Helius στο API Vault'
        });
        return [];
      }
      
      if (!address) {
        console.log('Missing address for Helius call');
        return [];
      }
      
      console.log(`Fetching token balances for address: ${address}`);
      
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
    return heliusKeyManager.getApiKey();
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
