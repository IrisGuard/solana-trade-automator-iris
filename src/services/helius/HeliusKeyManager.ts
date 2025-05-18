
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { FALLBACK_HELIUS_KEY } from './HeliusConfig';
import { toast } from 'sonner';

class HeliusKeyManager {
  private apiKeys: string[] = [];
  private currentKeyIndex = 0;
  private isInitialized = false;
  private lastRefreshTime = 0;
  private refreshInterval = 60 * 1000; // 1 minute
  private isRefreshing = false;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    // Initialize with default fallback key
    if (FALLBACK_HELIUS_KEY) {
      this.apiKeys = [FALLBACK_HELIUS_KEY];
    }
  }

  /**
   * Get an API key from the pool
   */
  public getApiKey(): string {
    // If not initialized, try to get a key asynchronously
    if (!this.isInitialized) {
      this.refreshKeys().catch(err => {
        console.error('Failed to refresh Helius API keys:', err);
      });
    }
    
    if (this.apiKeys.length === 0) {
      console.error('No Helius API keys available!');
      
      // Return a dummy key to prevent immediate crashes
      // This will likely fail API requests but prevents application crashes
      return "helius-key-missing-please-add-one";
    }

    // Round robin key selection
    const key = this.apiKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    
    return key;
  }

  /**
   * Force refresh of API keys from Supabase
   */
  public async refreshKeys(): Promise<boolean> {
    // Prevent concurrent refreshes
    if (this.isRefreshing) {
      console.log('Already refreshing Helius API keys, skipping duplicate request');
      return this.isInitialized;
    }
    
    const now = Date.now();
    
    // Don't refresh too frequently unless forced
    if (now - this.lastRefreshTime < this.refreshInterval && this.isInitialized && this.apiKeys.length > 0) {
      return this.isInitialized;
    }

    this.isRefreshing = true;
    
    try {
      this.lastRefreshTime = now;
      
      // Get API keys from Supabase - using api_keys_storage, not api_keys
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('key_value')
        .eq('service', 'helius')
        .eq('status', 'active');
      
      if (error) {
        console.error('Error fetching Helius API keys:', error);
        errorCollector.captureError(error, {
          component: 'HeliusKeyManager',
          method: 'refreshKeys',
          additional: 'Fallback to existing keys'
        });
        
        // Increment retry count
        this.retryCount++;
        
        if (this.retryCount >= this.maxRetries && this.apiKeys.length === 0) {
          // After max retries, show a toast only if we have no keys
          toast.error('Failed to load API keys', {
            description: 'Unable to connect to API key service'
          });
        }
        
        return this.apiKeys.length > 0;
      }
      
      // Extract keys from result
      if (data && data.length > 0) {
        const keys = data.map(row => row.key_value).filter(Boolean);
        
        if (keys.length > 0) {
          this.apiKeys = keys;
          this.isInitialized = true;
          this.retryCount = 0; // Reset retry count on success
          console.log(`Successfully loaded ${keys.length} Helius API keys`);
          return true;
        }
      }
      
      console.log('No Helius API keys found in database');
      
      // If no keys found, use fallback key
      if (FALLBACK_HELIUS_KEY && this.apiKeys.length === 0) {
        this.apiKeys = [FALLBACK_HELIUS_KEY];
        console.log('Using fallback Helius API key');
        return true;
      }
      
      return this.apiKeys.length > 0;
    } catch (error) {
      console.error('Exception refreshing Helius API keys:', error);
      errorCollector.captureError(error, {
        component: 'HeliusKeyManager',
        method: 'refreshKeys',
        additional: 'Unexpected exception'
      });
      
      return this.apiKeys.length > 0;
    } finally {
      this.isRefreshing = false;
    }
  }
  
  /**
   * Make sure keys are loaded before use
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized || this.apiKeys.length === 0) {
      await this.refreshKeys();
    }
  }

  /**
   * Force reload after configuration changes
   */
  public async forceReload(): Promise<void> {
    this.isInitialized = false;
    this.lastRefreshTime = 0;
    await this.refreshKeys();
    console.log("HeliusKeyManager force reloaded");
  }

  /**
   * Initialize for first use
   */
  public async initialize(): Promise<void> {
    this.isInitialized = false;
    this.retryCount = 0;
    await this.refreshKeys();
    console.log("HeliusKeyManager initialized");
  }
  
  /**
   * Get the number of available API keys
   */
  public getKeyCount(): number {
    return this.apiKeys.length;
  }
  
  /**
   * Check if at least one API key is available
   */
  public hasKeys(): boolean {
    return this.apiKeys.length > 0;
  }
}

// Export a singleton instance
export const heliusKeyManager = new HeliusKeyManager();
