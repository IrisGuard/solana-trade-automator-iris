
import { ApiKey } from "../types";
import { POTENTIAL_STORAGE_KEYS, COMMON_PASSWORDS, normalizeServiceName } from "./recoveryCore";
import { tryDecryptWithCommonPasswords } from "./encryptionUtils";
import { toast } from "sonner";

// Recovered key storage
const recoveredKeys: ApiKey[] = [];
const recoveryLocations: { storageKey: string; count: number }[] = [];

// Function to forcibly scan all storage for API keys
export function forceScanForKeys(): {
  keys: ApiKey[]; 
  locations: { storageKey: string; count: number }[]
} {
  recoveredKeys.length = 0;
  recoveryLocations.length = 0;
  
  try {
    // Scan all potential storage keys
    for (const storageKey of POTENTIAL_STORAGE_KEYS) {
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        processStorageItem(storageKey, storedData);
      }
    }
    
    // Scan all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !POTENTIAL_STORAGE_KEYS.includes(key)) {
        const data = localStorage.getItem(key);
        if (data) {
          processStorageItem(key, data);
        }
      }
    }
    
    // Deduplicate recovered keys
    const uniqueKeys = deduplicateKeys(recoveredKeys);
    
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
function processStorageItem(storageKey: string, data: string) {
  try {
    // First try to parse as JSON
    try {
      const parsed = JSON.parse(data);
      const extractedKeys = extractKeysFromData(parsed, storageKey);
      
      if (extractedKeys.length > 0) {
        recoveredKeys.push(...extractedKeys);
        recoveryLocations.push({ storageKey, count: extractedKeys.length });
      }
    } catch (e) {
      // Try to decrypt with common passwords if parsing fails
      const decrypted = tryDecryptWithCommonPasswords(data);
      if (decrypted) {
        const extractedKeys = extractKeysFromData(decrypted, storageKey);
        
        if (extractedKeys.length > 0) {
          recoveredKeys.push(...extractedKeys);
          recoveryLocations.push({ storageKey, count: extractedKeys.length });
        }
      }
    }
  } catch (e) {
    console.error(`Error processing storage item ${storageKey}:`, e);
  }
}

// Helper function to extract API keys from parsed data
function extractKeysFromData(data: any, source: string): ApiKey[] {
  const extractedKeys: ApiKey[] = [];
  
  // Handle array of items
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (isValidApiKey(item)) {
        extractedKeys.push(normalizeApiKey(item, source));
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
          }
        }
      }
    }
  }
  
  return extractedKeys;
}

// Check if an object is a valid API key
function isValidApiKey(item: any): boolean {
  return (
    item && 
    typeof item === 'object' && 
    (
      // Standard format
      (item.name && item.key && item.service) ||
      // Alternative format
      (item.name && (item.apiKey || item.token || item.secret) && (item.service || item.provider || item.type))
    )
  );
}

// Normalize an API key to standard format
function normalizeApiKey(item: any, source: string): ApiKey {
  const key = item.key || item.apiKey || item.token || item.secret;
  const service = item.service || item.provider || item.type || 'unknown';
  
  return {
    id: item.id || `recovery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: item.name,
    key: key,
    service: normalizeServiceName(service),
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    connected: !!item.connected,
    status: item.status || 'active',
    source: source
  };
}

// Function to deduplicate API keys
function deduplicateKeys(keys: ApiKey[]): ApiKey[] {
  const uniqueKeys: ApiKey[] = [];
  const keySet = new Set<string>();
  
  for (const key of keys) {
    // Create a unique signature for the key
    const signature = `${key.name}|${key.key}|${key.service}`;
    
    if (!keySet.has(signature)) {
      keySet.add(signature);
      uniqueKeys.push(key);
    }
  }
  
  return uniqueKeys;
}

