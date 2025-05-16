import { heliusKeyManager } from './HeliusKeyManager';
import { HELIUS_BASE_URL, HELIUS_CONFIG } from './HeliusConfig';
import { mockTransactions, generateMockTransactions } from '../mocks/mockTransactions';
import { errorCollector } from '@/utils/error-handling/collector';
import { validationService } from './ValidationService';

class HeliusService {
  /**
   * Get transaction history for a wallet address
   */
  public async getTransactionHistory(walletAddress: string, limit: number = 10) {
    try {
      console.log(`Fetching transaction history for wallet: ${walletAddress}`);
      
      // Ensure we have a valid API key
      await heliusKeyManager.refreshKeys();
      
      // Create the URL for the Helius API
      const url = new URL(`${HELIUS_BASE_URL}/addresses/${walletAddress}/transactions`);
      
      // Add the API key
      const apiKey = heliusKeyManager.getApiKey();
      console.log(`Using API key: ${apiKey.substring(0, 8)}... for fetching transactions`);
      url.searchParams.append('api-key', apiKey);
      
      // Add parameters
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('type', 'ALL');
      
      // Make the request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), HELIUS_CONFIG.timeout);
      
      try {
        const response = await fetch(url.toString(), { 
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Helius API error: ${response.status} - ${await response.text()}`);
        }
        
        const data = await response.json();
        console.log(`Received ${data.length || 0} transactions from Helius API`);
        
        if (data && data.length > 0) {
          return data;
        }
        
        // If no data, return mock data
        console.log('No real transactions found, returning mock data for testing');
        return mockTransactions;
      } catch (fetchError) {
        console.error('Fetch error in getTransactionHistory:', fetchError);
        
        // Return mock data on error
        console.log('API error, returning mock data for testing');
        return mockTransactions;
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'getTransactionHistory',
        additional: `Wallet: ${walletAddress.substring(0, 8)}...`
      });
      
      // Return mock data on error
      return mockTransactions;
    }
  }
  
  /**
   * Get token balances for a wallet
   */
  public async getTokenBalances(walletAddress: string) {
    try {
      // Ensure we have a valid API key
      await heliusKeyManager.refreshKeys();
      
      // Create the URL for the Helius API
      const url = new URL(`${HELIUS_BASE_URL}/addresses/${walletAddress}/balances`);
      
      // Add the API key
      const apiKey = heliusKeyManager.getApiKey();
      url.searchParams.append('api-key', apiKey);
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} - ${await response.text()}`);
      }
      
      const data = await response.json();
      return data.tokens || [];
    } catch (error) {
      console.error("Error fetching token balances:", error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'getTokenBalances',
        additional: `Wallet: ${walletAddress.substring(0, 8)}...`
      });
      
      return [];
    }
  }
  
  /**
   * Get token metadata for a list of token addresses
   */
  public async getTokenMetadata(tokenAddresses: string[]) {
    if (!tokenAddresses || tokenAddresses.length === 0) {
      return [];
    }
    
    try {
      // Ensure we have a valid API key
      await heliusKeyManager.refreshKeys();
      
      // Create the URL for the Helius API
      const url = new URL(`${HELIUS_BASE_URL}/token-metadata`);
      
      // Add the API key
      const apiKey = heliusKeyManager.getApiKey();
      url.searchParams.append('api-key', apiKey);
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mintAccounts: tokenAddresses })
      });
      
      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} - ${await response.text()}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error fetching token metadata:", error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'getTokenMetadata',
        additional: `Token count: ${tokenAddresses.length}`
      });
      
      return [];
    }
  }

  /**
   * Get token price data from Helius API
   * @param tokenAddress Token address to get price for
   * @returns Price data object or null if error
   */
  public async getTokenPrice(tokenAddress: string) {
    try {
      // Ensure we have a valid API key
      await heliusKeyManager.refreshKeys();
      
      // Create the URL for the Helius API
      const url = new URL(`${HELIUS_BASE_URL}/token-price`);
      
      // Add the API key
      const apiKey = heliusKeyManager.getApiKey();
      url.searchParams.append('api-key', apiKey);
      
      // Make the API call
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mintAccount: tokenAddress })
      });
      
      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} - ${await response.text()}`);
      }
      
      const data = await response.json();
      return {
        price: data.price || 0,
        priceChange24h: data.priceChange24h || 0,
        volume24h: data.volume24h || 0,
        marketCap: data.marketCap || 0
      };
    } catch (error) {
      console.error("Error fetching token price:", error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'getTokenPrice',
        additional: `Token: ${tokenAddress.substring(0, 8)}...`
      });
      
      return null;
    }
  }

  /**
   * Check if an API key is valid by using validation service
   */
  public async checkApiKey(apiKey: string): Promise<boolean> {
    try {
      return await validationService.checkApiKey(apiKey);
    } catch (error) {
      console.error("Error checking API key:", error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'checkApiKey'
      });
      return false;
    }
  }

  /**
   * Reinitialize service (for use after API key changes)
   */
  public async reinitialize(): Promise<void> {
    try {
      // Refresh keys from storage
      await heliusKeyManager.refreshKeys();
      console.log("HeliusService reinitialized successfully");
    } catch (error) {
      console.error("Error reinitializing HeliusService:", error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'reinitialize'
      });
    }
  }
}

// Export a singleton instance
export const heliusService = new HeliusService();
