
import { errorCollector } from '@/utils/error-handling/collector';
import { heliusKeyManager } from './HeliusKeyManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

class HeliusService {
  private baseUrl = 'https://api.helius.xyz/v0';
  private currentEndpoint = 0;
  private endpoints = ['mainnet-beta', 'devnet'];
  private apiKeyStatus = false;

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
      
      const url = `${this.baseUrl}/addresses/${address}/transactions?api-key=${apiKey}&limit=10`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
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

  private getApiKey(): string {
    return heliusKeyManager.getApiKey();
  }

  private getEndpoint(): string {
    return this.endpoints[this.currentEndpoint];
  }

  private rotateEndpoint(): void {
    this.currentEndpoint = (this.currentEndpoint + 1) % this.endpoints.length;
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
