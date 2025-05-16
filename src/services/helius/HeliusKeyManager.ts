
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { FALLBACK_HELIUS_KEY } from './HeliusConfig';

class HeliusKeyManager {
  private apiKeys: string[] = [];
  private currentKeyIndex = 0;
  private isInitialized = false;
  private lastRefreshTime = 0;
  private refreshInterval = 60 * 1000; // 1 minute

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
    this.ensureInitialized();
    
    if (this.apiKeys.length === 0) {
      console.error('No Helius API keys available!');
      throw new Error('Helius API not configured properly');
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
    const now = Date.now();
    
    // Don't refresh too frequently
    if (now - this.lastRefreshTime < this.refreshInterval) {
      return this.isInitialized;
    }

    try {
      this.lastRefreshTime = now;
      
      // Get API keys from Supabase
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_type', 'helius')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching Helius API keys:', error);
        errorCollector.collectError(error, {
          component: 'HeliusKeyManager',
          method: 'refreshKeys',
          additional: 'Fallback to existing keys'
        });
        
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
      
      // If no keys found, use fallback key
      if (FALLBACK_HELIUS_KEY && this.apiKeys.length === 0) {
        this.apiKeys = [FALLBACK_HELIUS_KEY];
        return true;
      }
      
      return this.apiKeys.length > 0;
    } catch (error) {
      console.error('Exception refreshing Helius API keys:', error);
      errorCollector.collectError(error, {
        component: 'HeliusKeyManager',
        method: 'refreshKeys',
        additional: 'Unexpected exception'
      });
      
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
}

// Export a singleton instance
export const heliusKeyManager = new HeliusKeyManager();
