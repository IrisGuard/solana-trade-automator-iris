
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';

export interface ApiKey {
  id: string;
  service: string;
  key_value: string;
  status: 'active' | 'expired' | 'revoked' | 'failing';
}

// Store the last time we checked for keys by service to prevent too frequent refreshes
const lastKeyRefresh: Record<string, number> = {};
const refreshInterval = 60 * 1000; // 1 minute
const keyCache: Record<string, ApiKey[]> = {};

// Store failed keys to prevent reusing them too quickly
const failedKeys: Record<string, { key: string, time: number }[]> = {};
const failedKeyTimeout = 5 * 60 * 1000; // 5 minutes

/**
 * Get an API key with automatic rotation for even distribution
 * @param service The service name (e.g. 'helius', 'jupiter')
 * @returns An API key or null if none available
 */
export async function getRotatedApiKey(service: string): Promise<string | null> {
  // Check if we need to refresh the keys
  const now = Date.now();
  if (!lastKeyRefresh[service] || now - lastKeyRefresh[service] > refreshInterval || !keyCache[service]) {
    await refreshApiKeys(service);
  }

  // Get the available active keys
  const activeKeys = (keyCache[service] || [])
    .filter(k => k.status === 'active');
    
  if (activeKeys.length === 0) {
    console.warn(`No active API keys found for ${service}`);
    return null;
  }

  // Filter out recently failed keys
  const recentFailedKeys = (failedKeys[service] || [])
    .filter(entry => now - entry.time < failedKeyTimeout)
    .map(entry => entry.key);
  
  const availableKeys = activeKeys.filter(key => !recentFailedKeys.includes(key.key_value));
  
  if (availableKeys.length === 0) {
    // If all keys have failed recently, we'll give the one with the oldest failure another try
    const oldestFailed = (failedKeys[service] || [])
      .sort((a, b) => a.time - b.time)[0];
      
    if (oldestFailed) {
      return oldestFailed.key;
    }
    
    return null;
  }
  
  // Simple rotation - get a random key from the available keys
  const randomIndex = Math.floor(Math.random() * availableKeys.length);
  return availableKeys[randomIndex].key_value;
}

/**
 * Refresh the API keys for a service
 */
export async function refreshApiKeys(service: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('api_keys_storage')
      .select('id, key_value, status')
      .eq('service', service)
      .eq('status', 'active');
    
    if (error) {
      console.error(`Error fetching ${service} API keys:`, error);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.warn(`No ${service} API keys found in the database`);
      keyCache[service] = [];
      return false;
    }
    
    keyCache[service] = data as ApiKey[];
    lastKeyRefresh[service] = Date.now();
    
    console.log(`Loaded ${data.length} ${service} API keys`);
    return true;
  } catch (error) {
    console.error(`Error refreshing ${service} API keys:`, error);
    errorCollector.captureError(error as Error, {
      component: 'apiKeyRotation',
      source: `refreshApiKeys:${service}`
    });
    return false;
  }
}

/**
 * Mark an API key as failing
 */
export function markKeyAsFailing(service: string, key: string): void {
  if (!failedKeys[service]) {
    failedKeys[service] = [];
  }
  
  // Add to the failed keys list
  failedKeys[service].push({ key, time: Date.now() });
  
  // Limit the list to prevent memory issues
  if (failedKeys[service].length > 20) {
    failedKeys[service] = failedKeys[service].slice(-20);
  }
  
  // Also try to update the key status in the database asynchronously
  updateKeyStatus(service, key, 'failing').catch(err => {
    console.error(`Failed to update key status for ${service}:`, err);
  });
}

/**
 * Update the status of an API key in the database
 */
async function updateKeyStatus(service: string, keyValue: string, status: 'active' | 'failing' | 'expired' | 'revoked'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('api_keys_storage')
      .update({ status })
      .eq('service', service)
      .eq('key_value', keyValue);
    
    if (error) {
      console.error(`Error updating ${service} API key status:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating ${service} API key status:`, error);
    return false;
  }
}

/**
 * Get the count of available API keys for a service
 */
export function getApiKeyCount(service: string): number {
  return (keyCache[service] || []).filter(k => k.status === 'active').length;
}
