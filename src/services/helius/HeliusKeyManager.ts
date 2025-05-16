
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { FALLBACK_HELIUS_KEY } from './HeliusConfig';

class HeliusKeyManager {
  private apiKeys: string[] = [];
  private currentKeyIndex = 0;
  private isInitialized = false;
  private lastRefreshTime = 0;
  private refreshInterval = 60 * 1000; // 1 minute
  private retryCount = 0;
  private maxRetries = 3;
  private fallbackKey = FALLBACK_HELIUS_KEY || 'ddb32813-1f4b-459d-8964-310b1b73a053';

  constructor() {
    // Initialize with default fallback key
    this.apiKeys = [this.fallbackKey];
    this.initialize();
  }

  /**
   * Get an API key from the pool
   */
  public getApiKey(): string {
    // Always ensure we have at least one key before proceeding
    this.ensureKeyAvailability();
    
    // Round robin key selection
    const key = this.apiKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    
    return key;
  }

  /**
   * Ensure we always have a valid key available
   */
  private ensureKeyAvailability(): void {
    if (this.apiKeys.length === 0) {
      console.warn('No Helius API keys available, using fallback key');
      this.apiKeys = [this.fallbackKey];
    }
  }

  /**
   * Force refresh of API keys from Supabase
   */
  public async refreshKeys(): Promise<boolean> {
    const now = Date.now();
    
    // Don't refresh too frequently unless forced
    if (now - this.lastRefreshTime < this.refreshInterval && this.isInitialized && this.retryCount === 0) {
      return this.apiKeys.length > 0;
    }

    try {
      this.lastRefreshTime = now;
      
      // Get API keys from Supabase
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('key_value')
        .eq('service', 'helius')
        .eq('status', 'active');
      
      if (error) {
        throw error;
      }
      
      // Extract keys from result
      if (data && data.length > 0) {
        const keys = data.map(row => row.key_value).filter(Boolean);
        
        if (keys.length > 0) {
          this.apiKeys = keys;
          this.isInitialized = true;
          this.retryCount = 0;
          console.log(`Loaded ${keys.length} Helius API keys`);
          return true;
        }
      }
      
      // If no keys found and we haven't exceeded max retries, try again later
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.warn(`No Helius API keys found, will retry (${this.retryCount}/${this.maxRetries})`);
        
        // Schedule a retry with exponential backoff
        setTimeout(() => this.refreshKeys(), Math.pow(2, this.retryCount) * 1000);
      } else {
        console.error("Failed to load Helius API keys after maximum retries");
      }
      
      // Make sure we have at least the fallback key
      this.ensureKeyAvailability();
      this.isInitialized = true;
      
      return this.apiKeys.length > 0;
    } catch (error) {
      console.error('Exception refreshing Helius API keys:', error);
      errorCollector.captureError(error, {
        component: 'HeliusKeyManager',
        method: 'refreshKeys',
        additional: 'Unexpected exception'
      });
      
      this.ensureKeyAvailability();
      return this.apiKeys.length > 0;
    }
  }
  
  /**
   * Validate an API key against the Helius API
   */
  public async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const url = `https://api.helius.xyz/v0/addresses/vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg/balances?api-key=${apiKey}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 200) {
        return true;
      }
      
      if (response.status === 429) {
        console.warn("Helius API rate limit exceeded during validation");
      }
      
      return false;
    } catch (error) {
      console.error("Error validating Helius API key:", error);
      return false;
    }
  }
  
  /**
   * Initialize for first use
   */
  public async initialize(): Promise<void> {
    this.isInitialized = false;
    await this.refreshKeys();
    console.log("HeliusKeyManager initialized");
  }
  
  /**
   * Force reload after configuration changes
   */
  public async forceReload(): Promise<void> {
    this.isInitialized = false;
    this.lastRefreshTime = 0;
    this.retryCount = 0;
    await this.refreshKeys();
    console.log("HeliusKeyManager force reloaded");
  }
}

// Export a singleton instance
export const heliusKeyManager = new HeliusKeyManager();
