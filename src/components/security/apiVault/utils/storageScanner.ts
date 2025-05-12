
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

// Extract API keys from JSON data - enhanced for better recovery
export function extractApiKeysFromData(data: any, source: string): ApiKey[] {
  const apiKeys: ApiKey[] = [];
  
  // Handle the case where data is an array of API keys directly
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item && typeof item === 'object') {
        // If it looks like an API key, normalize it
        if (isApiKeyLike(item)) {
          apiKeys.push(normalizeApiKey(item, source));
        }
        // Also check nested objects inside arrays
        else if (typeof item === 'object' && item !== null) {
          const nestedKeys = extractApiKeysFromData(item, source);
          apiKeys.push(...nestedKeys);
        }
      }
    });
  } else if (data && typeof data === 'object') {
    // Handle single object cases

    // First check if this object itself is an API key
    if (isApiKeyLike(data)) {
      apiKeys.push(normalizeApiKey(data, source));
    }
    
    // Now recursively check all properties
    for (const key in data) {
      // If the property is an object, scan it
      if (typeof data[key] === 'object' && data[key] !== null) {
        // If the property might be a collection of API keys
        if (isCollectionProperty(key)) {
          const collection = data[key];
          if (Array.isArray(collection)) {
            collection.forEach(item => {
              if (item && typeof item === 'object' && isApiKeyLike(item)) {
                apiKeys.push(normalizeApiKey(item, source));
              }
            });
          }
        }
      
        // Recursively check this property
        const nestedKeys = extractApiKeysFromData(data[key], `${source}.${key}`);
        apiKeys.push(...nestedKeys);
      }
    }
  }
  
  return apiKeys;
}

// Check if the property name suggests it might contain API keys
function isCollectionProperty(name: string): boolean {
  const keyRelatedNames = ['keys', 'apiKeys', 'tokens', 'credentials', 'auth'];
  return keyRelatedNames.some(term => name.toLowerCase().includes(term.toLowerCase()));
}

// Check if an object looks like an API key - enhanced detection
function isApiKeyLike(item: any): boolean {
  // Basic check: must have identifier and a key/token value
  const hasIdentifier = item && (
    item.name || 
    item.id || 
    item.service || 
    item.provider ||
    item.apiName
  );
  
  const hasKeyValue = item && (
    item.key || 
    item.token || 
    item.apiKey || 
    item.api_key ||
    item.secret ||
    item.accessToken ||
    item.access_token ||
    (typeof item.value === 'string' && item.value.length > 10)
  );
  
  if (hasIdentifier && hasKeyValue) {
    return true;
  }

  // Additional check for key-like strings
  const keyPatterns = [
    /^[A-Za-z0-9]{20,}$/, // Long alphanumeric strings
    /^[A-Za-z0-9_-]{20,}$/, // Base64-like strings
    /^sk-[A-Za-z0-9]{20,}$/, // OpenAI-like keys
    /^pk_[A-Za-z0-9]{10,}$/, // Stripe-like keys
    /^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/ // UUIDs
  ];
  
  // Check if any property matches a key pattern
  for (const prop in item) {
    if (typeof item[prop] === 'string' && item[prop].length >= 20) {
      for (const pattern of keyPatterns) {
        if (pattern.test(item[prop])) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Convert different formats to our standard API key format
function normalizeApiKey(item: any, source: string): ApiKey {
  // Extract the key value
  const key = 
    item.key || 
    item.token || 
    item.apiKey || 
    item.api_key || 
    item.secret ||
    item.accessToken ||
    item.access_token ||
    (typeof item.value === 'string' ? item.value : null);
    
  // Extract or generate a name
  let name = item.name || item.id || `API Key`;
  if (item.service || item.provider) {
    name = item.name || `${item.service || item.provider} API Key`;
  } else if (source) {
    name = item.name || `API Key from ${source}`;
  }
  
  // Extract or infer the service
  const service = 
    item.service || 
    item.provider || 
    item.type || 
    inferServiceFromKey(key) || 
    'unknown';
  
  // Create the normalized API key
  return {
    id: item.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: name,
    key: key,
    service: service,
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    connected: !!item.connected,
    status: item.status || 'active',
    source: source,
    description: item.description
  };
}

// Attempt to infer the service from the key format
function inferServiceFromKey(key: string): string | null {
  if (!key) return null;
  
  if (key.startsWith('sk-')) return 'openai';
  if (key.startsWith('pk_') || key.startsWith('sk_')) return 'stripe';
  if (key.startsWith('key-')) return 'sendgrid';
  if (key.startsWith('AKIA')) return 'aws';
  if (key.startsWith('ghp_')) return 'github';
  if (key.length >= 40 && /^[A-Za-z0-9]+$/.test(key)) return 'helius';
  
  return null;
}

// Force scan of localStorage for API keys
export function forceScanLocalStorage(): ApiKey[] {
  const allKeys: ApiKey[] = [];
  const storageKeys = searchAllLocalStorage();
  
  for (const storageKey of storageKeys) {
    const foundKeys = processStorageKey(storageKey);
    allKeys.push(...foundKeys);
  }
  
  // Attempt direct recovery of apiKeys from localStorage
  const apiKeysData = localStorage.getItem('apiKeys');
  if (apiKeysData) {
    try {
      const parsed = JSON.parse(apiKeysData);
      if (Array.isArray(parsed)) {
        allKeys.push(...parsed);
      }
    } catch (e) {
      console.error('Error parsing apiKeys:', e);
    }
  }
  
  // Remove duplicates
  const uniqueKeys = removeDuplicateKeys(allKeys);
  return uniqueKeys;
}

// Remove duplicate keys
function removeDuplicateKeys(keys: ApiKey[]): ApiKey[] {
  const uniqueMap = new Map<string, ApiKey>();
  
  keys.forEach(key => {
    const signature = `${key.key}-${key.service}`;
    if (!uniqueMap.has(signature)) {
      uniqueMap.set(signature, key);
    }
  });
  
  return Array.from(uniqueMap.values());
}
