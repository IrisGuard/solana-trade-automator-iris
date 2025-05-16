
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';

class HeliusKeyManager {
  private apiKeys: Map<string, string> = new Map();
  private currentKeyIndex = 0;
  private apiKeysArray: string[] = [];
  private initialized = false;

  constructor() {
    this.initialize();
  }

  public async initialize(): Promise<void> {
    try {
      console.log('Initializing HeliusKeyManager');
      await this.loadApiKeysFromSupabase();
      this.initialized = true;
      console.log(`HeliusKeyManager initialized with ${this.apiKeysArray.length} keys`);
    } catch (error) {
      console.error('Failed to initialize HeliusKeyManager:', error);
      this.reportError(new Error('Failed to initialize HeliusKeyManager'));
      
      // Add fallback key for development - using the provided key
      this.registerApiKey('ddb32813-1f4b-459d-8964-310b1b73a053', 'default-key');
      this.initialized = true;
    }
  }

  public async forceReload(): Promise<void> {
    try {
      console.log('Force reloading Helius API keys');
      this.apiKeys.clear();
      this.apiKeysArray = [];
      await this.loadApiKeysFromSupabase();
      console.log(`HeliusKeyManager reloaded with ${this.apiKeysArray.length} keys`);
    } catch (error) {
      console.error('Failed to reload Helius API keys:', error);
      this.reportError(new Error('Failed to reload Helius API keys'));
      
      // Make sure we have the default key
      this.registerApiKey('ddb32813-1f4b-459d-8964-310b1b73a053', 'default-key');
    }
  }

  private async loadApiKeysFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('id, key_value, name')
        .eq('service', 'helius')
        .eq('status', 'active');

      if (error) throw error;

      if (data && data.length > 0) {
        data.forEach(key => {
          this.registerApiKey(key.key_value, key.name || key.id);
        });
        console.log(`Loaded ${data.length} Helius API keys from Supabase`);
      } else {
        console.log('No Helius API keys found in Supabase, using fallback');
        // Use the provided key as fallback
        this.registerApiKey('ddb32813-1f4b-459d-8964-310b1b73a053', 'default-fallback');
      }
    } catch (error) {
      console.error('Failed to load Helius API keys from Supabase:', error);
      this.reportError(new Error('Failed to load Helius API keys from Supabase'));
    }
  }

  public getApiKey(): string {
    if (!this.initialized) {
      console.warn('HeliusKeyManager not initialized, returning default key');
      return 'ddb32813-1f4b-459d-8964-310b1b73a053';
    }
    
    if (this.apiKeysArray.length === 0) {
      this.reportError(new Error('No Helius API keys available'));
      return 'ddb32813-1f4b-459d-8964-310b1b73a053';
    }

    const key = this.apiKeysArray[this.currentKeyIndex];
    this.rotateKey();
    return key;
  }

  private rotateKey(): void {
    if (this.apiKeysArray.length > 1) {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeysArray.length;
    }
  }

  public registerApiKey(key: string, alias?: string): boolean {
    try {
      if (!key) {
        this.reportError(new Error('Invalid API key'));
        return false;
      }

      const keyAlias = alias || `helius-key-${this.apiKeys.size + 1}`;
      this.apiKeys.set(keyAlias, key);
      this.apiKeysArray = Array.from(this.apiKeys.values());
      console.log(`Registered Helius API key: ${key.substring(0, 8)}... as ${keyAlias}`);
      return true;
    } catch (error) {
      this.reportError(new Error('Failed to register API key'));
      return false;
    }
  }

  public removeApiKey(keyOrAlias: string): boolean {
    try {
      // Try to remove by alias
      if (this.apiKeys.has(keyOrAlias)) {
        this.apiKeys.delete(keyOrAlias);
        this.apiKeysArray = Array.from(this.apiKeys.values());
        return true;
      }

      // Try to remove by value
      for (const [alias, key] of this.apiKeys.entries()) {
        if (key === keyOrAlias) {
          this.apiKeys.delete(alias);
          this.apiKeysArray = Array.from(this.apiKeys.values());
          return true;
        }
      }

      return false;
    } catch (error) {
      this.reportError(new Error('Failed to remove API key'));
      return false;
    }
  }

  public getAllKeys(): string[] {
    return this.apiKeysArray;
  }

  public getKeyCount(): number {
    return this.apiKeysArray.length;
  }
  
  public isInitialized(): boolean {
    return this.initialized;
  }

  private reportError(error: Error): void {
    errorCollector.captureError(error, {
      component: 'HeliusKeyManager',
      source: 'client',
      severity: 'medium'
    });
  }
}

export const heliusKeyManager = new HeliusKeyManager();
