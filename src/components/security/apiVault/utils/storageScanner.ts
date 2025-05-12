
import { ApiKey } from "../types";

// Function to search all of localStorage for keys
export function searchAllLocalStorage(): string[] {
  const foundItems: string[] = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        foundItems.push(key);
      }
    }
  } catch (e) {
    console.error('Error scanning localStorage:', e);
  }
  
  return foundItems;
}

// Process a specific storage key to find API keys
export function processStorageKey(storageKey: string): ApiKey[] {
  try {
    const storedData = localStorage.getItem(storageKey);
    if (!storedData) return [];
    
    try {
      const parsed = JSON.parse(storedData);
      return extractApiKeysFromData(parsed, storageKey);
    } catch (e) {
      // Not valid JSON
      return [];
    }
  } catch (e) {
    console.error(`Error processing storage key ${storageKey}:`, e);
    return [];
  }
}

// Extract API keys from JSON data
export function extractApiKeysFromData(data: any, source: string): ApiKey[] {
  const apiKeys: ApiKey[] = [];
  
  if (Array.isArray(data)) {
    // Handle array of items
    data.forEach(item => {
      if (item && typeof item === 'object' && isApiKeyLike(item)) {
        apiKeys.push(normalizeApiKey(item, source));
      }
    });
  } else if (data && typeof data === 'object') {
    // Handle single item
    if (isApiKeyLike(data)) {
      apiKeys.push(normalizeApiKey(data, source));
    }
    
    // Recursively check properties
    for (const key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        const nestedKeys = extractApiKeysFromData(data[key], source);
        apiKeys.push(...nestedKeys);
      }
    }
  }
  
  return apiKeys;
}

// Check if an object looks like an API key
function isApiKeyLike(item: any): boolean {
  // Basic check: must have a key/token and name/id
  return (
    item &&
    (item.key || item.token || item.apiKey || item.api_key) &&
    (item.name || item.id || item.service || item.provider)
  );
}

// Convert different formats to our standard API key format
function normalizeApiKey(item: any, source: string): ApiKey {
  return {
    id: item.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: item.name || `API Key - ${item.service || source}`,
    key: item.key || item.token || item.apiKey || item.api_key,
    service: item.service || item.provider || 'unknown',
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    connected: !!item.connected,
    status: item.status || 'active',
    source: source
  };
}
