
import { heliusKeyManager } from './HeliusKeyManager';
import { HELIUS_BASE_URL, REQUEST_TIMEOUT, RATE_LIMIT, RETRY_CONFIG } from './HeliusConfig';
import { errorCollector } from '@/utils/error-handling/collector';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  maxRetries?: number;
}

class HeliusService {
  private requestCounts = {
    minute: { count: 0, timestamp: Date.now() },
    hour: { count: 0, timestamp: Date.now() },
    day: { count: 0, timestamp: Date.now() }
  };

  constructor() {
    // Reset counters periodically
    setInterval(() => this.resetCounter('minute'), 60 * 1000);
    setInterval(() => this.resetCounter('hour'), 60 * 60 * 1000);
    setInterval(() => this.resetCounter('day'), 24 * 60 * 60 * 1000);
  }
  
  private resetCounter(type: 'minute' | 'hour' | 'day') {
    this.requestCounts[type] = { count: 0, timestamp: Date.now() };
  }
  
  private checkRateLimit(): boolean {
    const now = Date.now();
    
    // Reset counters if the time period has elapsed
    if (now - this.requestCounts.minute.timestamp > 60 * 1000) {
      this.resetCounter('minute');
    }
    if (now - this.requestCounts.hour.timestamp > 60 * 60 * 1000) {
      this.resetCounter('hour');
    }
    if (now - this.requestCounts.day.timestamp > 24 * 60 * 60 * 1000) {
      this.resetCounter('day');
    }
    
    // Check if rate limits are exceeded
    if (
      this.requestCounts.minute.count >= RATE_LIMIT.maxRequestsPerMinute ||
      this.requestCounts.hour.count >= RATE_LIMIT.maxRequestsPerHour ||
      this.requestCounts.day.count >= RATE_LIMIT.maxRequestsPerDay
    ) {
      return false;
    }
    
    // Increment counters
    this.requestCounts.minute.count++;
    this.requestCounts.hour.count++;
    this.requestCounts.day.count++;
    
    return true;
  }
  
  private async fetchWithTimeout(url: string, options: RequestOptions = {}): Promise<Response> {
    const { timeout = REQUEST_TIMEOUT } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      return response;
    } finally {
      clearTimeout(id);
    }
  }
  
  private async fetchWithRetry(url: string, options: RequestOptions = {}): Promise<Response> {
    const { maxRetries = RETRY_CONFIG.maxRetries } = options;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Check rate limit before making request
        if (!this.checkRateLimit()) {
          throw new Error("Rate limit exceeded");
        }
        
        // Make the request
        const response = await this.fetchWithTimeout(url, options);
        
        // If successful or not a retryable error, return immediately
        if (response.ok || 
            ![408, 429, 500, 502, 503, 504].includes(response.status)) {
          return response;
        }
        
        // For rate limiting (429), add additional delay
        const retryAfter = response.headers.get('Retry-After');
        let delayMs = RETRY_CONFIG.initialDelayMs * Math.pow(2, attempt);
        
        if (retryAfter) {
          delayMs = Math.max(delayMs, parseInt(retryAfter, 10) * 1000);
        }
        
        delayMs = Math.min(delayMs, RETRY_CONFIG.maxDelayMs);
        
        console.warn(`Helius API request failed (${response.status}), retrying after ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        if (error.name === 'AbortError') {
          console.warn(`Request timeout, retrying (${attempt + 1}/${maxRetries + 1})...`);
        } else {
          console.warn(`Fetch error (${error.message}), retrying (${attempt + 1}/${maxRetries + 1})...`);
        }
        
        const delayMs = RETRY_CONFIG.initialDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    throw new Error("Maximum retries exceeded");
  }
  
  /**
   * Make a request to the Helius API
   */
  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      // Get API key
      const apiKey = heliusKeyManager.getApiKey();
      
      // Build URL
      let url = endpoint.startsWith('http') ? endpoint : `${HELIUS_BASE_URL}${endpoint}`;
      
      // Add API key to URL if it doesn't already have one
      if (!url.includes('api-key=')) {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}api-key=${apiKey}`;
      }
      
      // Default headers
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      // Make request with retry logic
      const response = await this.fetchWithRetry(url, {
        ...options,
        headers
      });
      
      // Handle non-successful responses
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Helius API error (${response.status}): ${errorText}`);
      }
      
      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error) {
      // Log and report error
      console.error(`Helius API request failed: ${error.message}`, error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'request',
        details: { endpoint }
      });
      throw error;
    }
  }
  
  /**
   * Check if a Helius API key is valid
   */
  public async checkApiKey(apiKey: string): Promise<boolean> {
    return heliusKeyManager.validateApiKey(apiKey);
  }
  
  /**
   * Fetch transactions for a wallet address
   */
  public async fetchTransactions(address: string, limit: number = 10): Promise<any[]> {
    try {
      const endpoint = `/addresses/${address}/transactions`;
      
      const data = await this.request<any>(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return Array.isArray(data) ? data.slice(0, limit) : [];
    } catch (error) {
      console.error(`Error fetching transactions for ${address}:`, error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'fetchTransactions',
        details: { address, limit }
      });
      return [];
    }
  }

  /**
   * Get transaction history for an address (alias for compatibility)
   */
  public async getTransactionHistory(address: string, limit: number = 10): Promise<any[]> {
    return this.fetchTransactions(address, limit);
  }
  
  /**
   * Fetch token balances for a wallet address
   */
  public async fetchTokenBalances(address: string): Promise<any> {
    try {
      const endpoint = `/addresses/${address}/balances`;
      
      return this.request<any>(endpoint, {
        method: 'GET'
      });
    } catch (error) {
      console.error(`Error fetching token balances for ${address}:`, error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'fetchTokenBalances',
        details: { address }
      });
      throw error;
    }
  }
  
  /**
   * Get token metadata for a list of token addresses
   */
  public async getTokenMetadata(tokenAddresses: string[]): Promise<any[]> {
    try {
      const apiKey = heliusKeyManager.getApiKey();
      const url = `${HELIUS_BASE_URL}/token-metadata?api-key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mintAccounts: tokenAddresses }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'getTokenMetadata',
        details: { tokenCount: tokenAddresses.length }
      });
      return [];
    }
  }

  /**
   * Get price information for a token
   */
  public async getTokenPrice(tokenAddress: string): Promise<any> {
    try {
      const apiKey = heliusKeyManager.getApiKey();
      const url = `${HELIUS_BASE_URL}/token-price?api-key=${apiKey}&mint=${tokenAddress}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching token price for ${tokenAddress}:`, error);
      errorCollector.captureError(error, {
        component: 'HeliusService',
        method: 'getTokenPrice',
        details: { tokenAddress }
      });
      return null;
    }
  }
  
  /**
   * Reinitialize the service (reload API keys)
   */
  public async reinitialize(): Promise<void> {
    await heliusKeyManager.forceReload();
  }
}

// Export singleton instance
export const heliusService = new HeliusService();
