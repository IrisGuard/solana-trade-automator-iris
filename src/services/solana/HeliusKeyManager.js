// Basic implementation without TypeScript for backwards compatibility
const { errorCollector } = require('../../utils/error-handling/collector');
const { supabase } = require('../../integrations/supabase/client');

class HeliusKeyManager {
  constructor() {
    this.keys = new Map();
    this.initialized = false;
    this.mainKeys = [];
    this.devKeys = [];
    this.backupKeys = [];
    this.defaultKey = 'ddb32813-1f4b-459d-8964-310b1b73a053'; // Demo key
  }
  
  // Initialize method is the same as in the TypeScript version
  async initialize() {
    try {
      // First try to load from Supabase
      const { data: apiKeys, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('service', 'helius')
        .eq('status', 'active');
        
      if (error) {
        throw error;
      }
      
      // Clear existing keys
      this.keys.clear();
      this.mainKeys = [];
      this.devKeys = [];
      this.backupKeys = [];
      
      // Process each key
      if (apiKeys && apiKeys.length > 0) {
        apiKeys.forEach(key => {
          // Extract environment from name or description
          const env = this.determineEnvironment(key.name, key.description);
          
          // Extract scope from name or description
          const scope = this.determineScope(key.name, key.description);
          
          const heliusKey = {
            id: key.id,
            value: key.key_value,
            environment: env,
            scope: scope,
            isActive: key.status === 'active',
            usageCount: 0
          };
          
          // Add to appropriate collection
          this.keys.set(key.id, heliusKey);
          
          if (env === 'production') {
            this.mainKeys.push(heliusKey);
          } else if (env === 'development') {
            this.devKeys.push(heliusKey);
          } else if (env === 'backup') {
            this.backupKeys.push(heliusKey);
          }
        });
        
        this.initialized = true;
        console.log(`HeliusKeyManager initialized with ${this.keys.size} keys`);
        return true;
      } else {
        console.warn('No Helius API keys found in database');
        this.initialized = false;
        return false;
      }
    } catch (error) {
      errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'HeliusKeyManager',
        source: 'initialize',
        severity: 'high'
      });
      
      this.initialized = false;
      return false;
    }
  }
  
  getKey(options = {}) {
    if (!this.initialized) {
      return this.defaultKey;
    }
    
    try {
      const env = options.environment || 'production';
      const scope = options.scope || 'general';
      
      // Select key collection based on environment
      let keyCollection = this.mainKeys;
      if (env === 'development') {
        keyCollection = this.devKeys;
      } else if (env === 'backup') {
        keyCollection = this.backupKeys;
      }
      
      // First try to find a key matching the requested scope
      const scopedKeys = keyCollection.filter(key => key.scope === scope && key.isActive);
      
      if (scopedKeys.length > 0) {
        // Get the least used key
        const selectedKey = this.getLeastUsedKey(scopedKeys);
        this.trackKeyUsage(selectedKey);
        return selectedKey.value;
      }
      
      // If no matching scope, use any active key from the collection
      const activeKeys = keyCollection.filter(key => key.isActive);
      if (activeKeys.length > 0) {
        const selectedKey = this.getLeastUsedKey(activeKeys);
        this.trackKeyUsage(selectedKey);
        return selectedKey.value;
      }
      
      // If no keys in requested environment, try using a production key as fallback
      if (env !== 'production' && this.mainKeys.length > 0) {
        const fallbackKey = this.getLeastUsedKey(this.mainKeys.filter(key => key.isActive));
        console.warn(`Using production key as fallback for ${env}/${scope}`);
        this.trackKeyUsage(fallbackKey);
        return fallbackKey.value;
      }
      
      // Last resort - use backup keys if available
      if (this.backupKeys.length > 0 && env !== 'backup') {
        const backupKey = this.getLeastUsedKey(this.backupKeys.filter(key => key.isActive));
        console.warn(`Using backup key as last resort for ${env}/${scope}`);
        this.trackKeyUsage(backupKey);
        return backupKey.value;
      }
      
      // If all else fails, return default key
      console.warn('No suitable Helius API key found, using default key');
      return this.defaultKey;
    } catch (error) {
      errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'HeliusKeyManager',
        source: 'getKey',
        severity: 'medium'
      });
      
      return this.defaultKey;
    }
  }
  
  determineEnvironment(name, description) {
    const text = `${name} ${description || ''}`.toLowerCase();
    
    if (text.includes('backup') || text.includes('emergency')) {
      return 'backup';
    } else if (text.includes('dev') || text.includes('test') || text.includes('staging')) {
      return 'development';
    } else {
      return 'production';
    }
  }
  
  determineScope(name, description) {
    const text = `${name} ${description || ''}`.toLowerCase();
    
    if (text.includes('transaction')) {
      return 'transactions';
    } else if (text.includes('nft')) {
      return 'nft';
    } else if (text.includes('asset')) {
      return 'assets';
    } else if (text.includes('websocket') || text.includes('socket') || text.includes('ws')) {
      return 'websocket';
    } else {
      return 'general';
    }
  }
  
  getLeastUsedKey(keys) {
    if (keys.length === 0) {
      throw new Error('No keys available');
    }
    
    return keys.reduce((prev, current) => 
      (prev.usageCount < current.usageCount) ? prev : current
    );
  }
  
  trackKeyUsage(key) {
    key.usageCount++;
    key.lastUsed = new Date();
  }
  
  markKeyAsInactive(keyValue) {
    for (const [id, key] of this.keys.entries()) {
      if (key.value === keyValue) {
        key.isActive = false;
        
        // Update key status in database
        supabase
          .from('api_keys_storage')
          .update({
            status: 'failing',
            status_message: 'Automatically disabled due to API errors'
          })
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.error('Failed to update key status:', error);
            }
          });
        
        break;
      }
    }
  }
  
  get activeKeyCount() {
    let count = 0;
    for (const key of this.keys.values()) {
      if (key.isActive) count++;
    }
    return count;
  }
}

// Export a singleton instance
const heliusKeyManager = new HeliusKeyManager();
module.exports = { heliusKeyManager };
