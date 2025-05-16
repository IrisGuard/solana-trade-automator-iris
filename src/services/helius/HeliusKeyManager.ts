
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { FALLBACK_HELIUS_KEY } from './HeliusConfig';

class HeliusKeyManager {
  private apiKeys: string[] = [];
  private currentKeyIndex = 0;
  private isInitialized = false;
  private lastRefreshTime = 0;
  private refreshInterval = 60 * 1000; // 1 minute
  private fallbackKey = 'ddb32813-1f4b-459d-8964-310b1b73a053'; // Default fallback key

  constructor() {
    // Initialize with default fallback key
    this.apiKeys = [this.fallbackKey];
    
    // If configured fallback key exists, add it too
    if (FALLBACK_HELIUS_KEY && FALLBACK_HELIUS_KEY !== this.fallbackKey) {
      this.apiKeys.push(FALLBACK_HELIUS_KEY);
    }
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
    
    // Don't refresh too frequently
    if (now - this.lastRefreshTime < this.refreshInterval && this.isInitialized) {
      return this.apiKeys.length > 0;
    }

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
        
        this.ensureKeyAvailability();
        return this.apiKeys.length > 0;
      }
      
      // Extract keys from result
      if (data && data.length > 0) {
        const keys = data.map(row => row.key_value).filter(Boolean);
        
        if (keys.length > 0) {
          this.apiKeys = keys;
          this.isInitialized = true;
          return true;
        }
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
   * Make sure keys are loaded before use
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
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
    await this.refreshKeys();
    console.log("HeliusKeyManager initialized");
  }
}

// Export a singleton instance
export const heliusKeyManager = new HeliusKeyManager();
