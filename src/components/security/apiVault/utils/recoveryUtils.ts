
import { ApiKey } from "../types";
import { POTENTIAL_STORAGE_KEYS, COMMON_PASSWORDS, normalizeServiceName } from "./recoveryCore";
import { tryDecryptWithCommonPasswords } from "./encryptionUtils";
import { toast } from "sonner";
import { searchAllLocalStorage, processStorageKey, forceScanLocalStorage } from "./storageScanner";

// Function to forcibly scan all storage for API keys
export function forceScanForKeys(): {
  keys: ApiKey[]; 
  locations: { storageKey: string; count: number }[]
} {
  const recoveredKeys: ApiKey[] = [];
  const recoveryLocations: { storageKey: string; count: number }[] = [];
  
  try {
    // First try the direct method to recover stored keys
    const allStorageKeys = searchAllLocalStorage();
    
    // First check the dedicated API keys storage
    if (allStorageKeys.includes('apiKeys')) {
      const storedData = localStorage.getItem('apiKeys');
      if (storedData) {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(storedData);
          if (Array.isArray(parsed)) {
            recoveredKeys.push(...parsed);
            recoveryLocations.push({ storageKey: 'apiKeys', count: parsed.length });
            console.log(`Recovered ${parsed.length} keys directly from apiKeys storage`);
          }
        } catch (e) {
          console.error('Error parsing apiKeys storage:', e);
          
          // Try to decrypt if parsing fails
          const decrypted = tryDecryptWithCommonPasswords(storedData);
          if (decrypted && Array.isArray(decrypted)) {
            recoveredKeys.push(...decrypted);
            recoveryLocations.push({ storageKey: 'apiKeys (encrypted)', count: decrypted.length });
            console.log(`Recovered ${decrypted.length} keys from encrypted apiKeys storage`);
          }
        }
      }
    }
    
    // Scan all potential storage keys
    for (const storageKey of POTENTIAL_STORAGE_KEYS) {
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        const extractedKeys = processStorageItem(storageKey, storedData);
        if (extractedKeys.length > 0) {
          recoveredKeys.push(...extractedKeys);
          recoveryLocations.push({ storageKey, count: extractedKeys.length });
        }
      }
    }
    
    // Scan all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !POTENTIAL_STORAGE_KEYS.includes(key) && key !== 'apiKeys') {
        const data = localStorage.getItem(key);
        if (data) {
          const extractedKeys = processStorageItem(key, data);
          if (extractedKeys.length > 0) {
            recoveredKeys.push(...extractedKeys);
            recoveryLocations.push({ storageKey: key, count: extractedKeys.length });
          }
        }
      }
    }
    
    // Deduplicate recovered keys
    const uniqueKeys = deduplicateKeys(recoveredKeys);
    
    console.log(`Total recovered: ${uniqueKeys.length} unique keys from ${recoveryLocations.length} locations`);
    
    return {
      keys: uniqueKeys,
      locations: recoveryLocations
    };
  } catch (e) {
    console.error('Error during force scan:', e);
    return { keys: [], locations: [] };
  }
}

// Function to recover all API keys from storage
export function recoverAllApiKeys(): {
  keys: ApiKey[]; 
  locations: { storageKey: string; count: number }[]
} {
  const result = forceScanForKeys();
  
  if (result.keys.length > 0) {
    toast.success(`Recovered ${result.keys.length} API keys from ${result.locations.length} locations`);
  } else {
    toast.info('No API keys found in storage');
  }
  
  return result;
}

// Helper function to process a storage item
function processStorageItem(storageKey: string, data: string): ApiKey[] {
  const extractedKeys: ApiKey[] = [];
  
  try {
    // First try to parse as JSON
    try {
      const parsed = JSON.parse(data);
      const keys = extractKeysFromData(parsed, storageKey);
      if (keys.length > 0) {
        extractedKeys.push(...keys);
      }
    } catch (e) {
      // Try to decrypt with common passwords if parsing fails
      const decrypted = tryDecryptWithCommonPasswords(data);
      if (decrypted) {
        const keys = extractKeysFromData(decrypted, storageKey);
        if (keys.length > 0) {
          extractedKeys.push(...keys);
        }
      }
    }
  } catch (e) {
    console.error(`Error processing storage item ${storageKey}:`, e);
  }
  
  return extractedKeys;
}

// Helper function to extract API keys from parsed data
function extractKeysFromData(data: any, source: string): ApiKey[] {
  const extractedKeys: ApiKey[] = [];
  
  // Handle array of items
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (isValidApiKey(item)) {
        extractedKeys.push(normalizeApiKey(item, source));
      } else if (item && typeof item === 'object') {
        // Check if there are nested keys in this object
        const nestedKeys = extractKeysFromData(item, source);
        extractedKeys.push(...nestedKeys);
      }
    });
  }
  // Handle object with key/value pairs
  else if (data && typeof data === 'object') {
    // Check if the object itself is an API key
    if (isValidApiKey(data)) {
      extractedKeys.push(normalizeApiKey(data, source));
    }
    // Check object properties for nested API keys
    else {
      for (const key in data) {
        const value = data[key];
        
        if (Array.isArray(value)) {
          // Recursive extraction from array
          const nestedKeys = extractKeysFromData(value, source);
          extractedKeys.push(...nestedKeys);
        }
        else if (value && typeof value === 'object') {
          // Check if nested object is an API key
          if (isValidApiKey(value)) {
            extractedKeys.push(normalizeApiKey(value, source));
          } else {
            // Recursive extraction from nested object
            const nestedKeys = extractKeysFromData(value, source);
            extractedKeys.push(...nestedKeys);
          }
        }
      }
    }
  }
  
  return extractedKeys;
}

// Check if an object is a valid API key
function isValidApiKey(item: any): boolean {
  if (!item || typeof item !== 'object') return false;
  
  // Standard format
  if (item.name && item.key && item.service) return true;
  
  // Alternative formats
  if (item.name && (item.apiKey || item.token || item.secret) && 
     (item.service || item.provider || item.type)) return true;
     
  // Minimal format with name and some kind of key
  if (item.name && (
    item.key || item.apiKey || item.token || item.secret || 
    item.accessToken || item.access_token
  )) return true;
  
  return false;
}

// Normalize an API key to standard format
function normalizeApiKey(item: any, source: string): ApiKey {
  const key = item.key || item.apiKey || item.token || item.secret || 
              item.accessToken || item.access_token;
  const service = item.service || item.provider || item.type || 'unknown';
  
  return {
    id: item.id || `recovery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: item.name,
    key: key,
    service: normalizeServiceName(service),
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    connected: !!item.connected,
    status: item.status || 'active',
    source: source,
    description: item.description
  };
}

// Function to deduplicate API keys
function deduplicateKeys(keys: ApiKey[]): ApiKey[] {
  const uniqueKeys: ApiKey[] = [];
  const keySet = new Set<string>();
  
  for (const key of keys) {
    // Create a unique signature for the key - just using the key itself is usually enough
    const signature = key.key;
    
    if (!keySet.has(signature)) {
      keySet.add(signature);
      uniqueKeys.push(key);
    }
  }
  
  return uniqueKeys;
}
