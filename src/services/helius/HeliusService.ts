
import { errorCollector } from '@/utils/error-handling/collector';
import { heliusKeyManager } from './HeliusKeyManager';
import { supabase } from '@/integrations/supabase/client';

class HeliusService {
  private baseUrl = 'https://api.helius.xyz/v0';
  private currentEndpoint = 0;
  private endpoints = ['mainnet-beta', 'devnet'];

  constructor() {
    console.log('HeliusService initialized');
  }

  public async getTokenBalances(address: string): Promise<any[]> {
    try {
      const apiKey = this.getApiKey();
      
      if (!apiKey || !address) {
        console.log('Missing API key or address for Helius call');
        return [];
      }
      
      if (address === 'demo') {
        console.log('Demo mode detected, returning sample data');
        return [
          { mint: 'So11111111111111111111111111111111111111112', amount: 1.5, decimals: 9 },
          { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', amount: 100, decimals: 6 }
        ];
      }
      
      const url = `${this.baseUrl}/token-balances?api-key=${apiKey}&address=${address}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.tokens || [];
    } catch (error) {
      this.reportError(new Error(`Failed to get token balances: ${error}`));
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
      
      if (address === 'demo') {
        return [
          { signature: '5mZ1vT1gZS', timestamp: Date.now() - 3600000, type: 'SOL_TRANSFER' },
          { signature: '2xC3vRt9pL', timestamp: Date.now() - 7200000, type: 'TOKEN_TRANSFER' }
        ];
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
      const apiKey = this.getApiKey();
      
      if (!apiKey || !mintAddresses.length) {
        console.log('Missing API key or mint addresses for Helius call');
        return [];
      }
      
      // For specific mint addresses, use sample data for demo
      if (mintAddresses.includes('So11111111111111111111111111111111111111112')) {
        return [{
          mint: 'So11111111111111111111111111111111111111112',
          name: 'Wrapped SOL',
          symbol: 'SOL',
          decimals: 9,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        }];
      }
      
      const url = `${this.baseUrl}/token-metadata?api-key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mintAccounts: mintAddresses }),
      });
      
      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      this.reportError(new Error(`Failed to get token metadata: ${error}`));
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
      const url = `${this.baseUrl}/status?api-key=${apiKey}`;
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      console.error('Error checking Helius API key:', error);
      return false;
    }
  }
}

export const heliusService = new HeliusService();
