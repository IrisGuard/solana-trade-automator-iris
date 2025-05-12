
import { toast } from 'sonner';
import { ApiSettings } from '@/components/wallet/api-vault/types';

// Types for Raydium API responses
export interface RaydiumPair {
  name: string;
  pairId: string;
  baseDecimals: number;
  baseSymbol: string;
  basePoolAmount: string;
  quoteDecimals: number;
  quoteSymbol: string;
  quotePoolAmount: string;
  lpDecimals: number;
  lpMint: string;
  ammId: string;
  apr24H: number;
  apr7D: number;
  volume24H: number;
  volume24HQuote: number;
  volume7D: number;
  volume7DQuote: number;
  fee24H: number;
  fee7D: number;
  liquidity: number;
  price: number;
  priceChange24H: number;
  priceChange7D: number;
}

export interface RaydiumToken {
  symbol: string;
  name: string;
  mint: string;
  decimals: number;
  extensions: {
    coingeckoId?: string;
    website?: string;
    twitter?: string;
  };
  icon: string;
  hasFreeze: boolean;
  tags: string[];
}

export interface RaydiumPoolInfo {
  id: string;
  baseMint: string;
  quoteMint: string;
  lpMint: string;
  baseDecimals: number;
  quoteDecimals: number;
  lpDecimals: number;
  version: number;
  programId: string;
  authority: string;
  baseVault: string;
  quoteVault: string;
  withdrawQueue: string;
  lpVault: string;
  marketVersion: number;
  marketProgramId: string;
  marketId: string;
  marketBaseVault: string;
  marketQuoteVault: string;
  marketBids: string;
  marketAsks: string;
  marketEventQueue: string;
}

class RaydiumService {
  private getBaseUrl(apiSettings: ApiSettings): string {
    const baseUrl = apiSettings.raydiumApiEndpoint || 'https://api.raydium.io';
    const version = apiSettings.raydiumApiVersion || 'v2';
    return `${baseUrl}/${version}`;
  }
  
  // Fetch all trading pairs
  async getAllPairs(apiSettings: ApiSettings): Promise<RaydiumPair[]> {
    try {
      if (!apiSettings.raydiumEnabled) {
        console.log('Raydium API is disabled in settings');
        return [];
      }
      
      const response = await fetch(`${this.getBaseUrl(apiSettings)}/main/pairs`);
      
      if (!response.ok) {
        throw new Error(`Raydium API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Raydium pairs:', error);
      toast.error('Failed to load Raydium trading pairs');
      return [];
    }
  }
  
  // Get specific pair information by ID
  async getPairById(pairId: string, apiSettings: ApiSettings): Promise<RaydiumPair | null> {
    try {
      if (!apiSettings.raydiumEnabled) {
        console.log('Raydium API is disabled in settings');
        return null;
      }
      
      const response = await fetch(`${this.getBaseUrl(apiSettings)}/main/pair/${pairId}`);
      
      if (!response.ok) {
        throw new Error(`Raydium API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || null;
    } catch (error) {
      console.error(`Error fetching Raydium pair ${pairId}:`, error);
      toast.error('Failed to load pair information');
      return null;
    }
  }
  
  // Get pool information
  async getPoolInfo(ammId: string, apiSettings: ApiSettings): Promise<RaydiumPoolInfo | null> {
    try {
      if (!apiSettings.raydiumEnabled) {
        console.log('Raydium API is disabled in settings');
        return null;
      }
      
      const response = await fetch(`${this.getBaseUrl(apiSettings)}/main/amm/${ammId}`);
      
      if (!response.ok) {
        throw new Error(`Raydium API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || null;
    } catch (error) {
      console.error(`Error fetching Raydium pool info ${ammId}:`, error);
      toast.error('Failed to load pool information');
      return null;
    }
  }
  
  // Get all listed tokens
  async getTokens(apiSettings: ApiSettings): Promise<RaydiumToken[]> {
    try {
      if (!apiSettings.raydiumEnabled) {
        console.log('Raydium API is disabled in settings');
        return [];
      }
      
      const response = await fetch(`${this.getBaseUrl(apiSettings)}/main/token-list`);
      
      if (!response.ok) {
        throw new Error(`Raydium API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Raydium tokens:', error);
      toast.error('Failed to load Raydium tokens');
      return [];
    }
  }
  
  // Get token price information
  async getTokenPrice(mint: string, apiSettings: ApiSettings): Promise<number | null> {
    try {
      if (!apiSettings.raydiumEnabled) {
        console.log('Raydium API is disabled in settings');
        return null;
      }
      
      const response = await fetch(`${this.getBaseUrl(apiSettings)}/main/price?mints=${mint}`);
      
      if (!response.ok) {
        throw new Error(`Raydium API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data && data.data[mint] ? data.data[mint] : null;
    } catch (error) {
      console.error(`Error fetching Raydium token price for ${mint}:`, error);
      toast.error('Failed to load token price');
      return null;
    }
  }
}

export const raydiumService = new RaydiumService();
