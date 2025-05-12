import { ApiKey } from "../types";
import CryptoJS from "crypto-js";
import { diagnosticScanStorage } from "./diagnosticUtils";
import { toast } from "sonner";

// Expanded list of potential storage keys to search for API keys
const POTENTIAL_STORAGE_KEYS = [
  'apiKeys',
  'api-keys', 
  'apikeyvault', 
  'secure-api-keys',
  'user-api-keys',
  'walletApiKeys',
  'applicationKeys',
  'devKeys',
  'serviceKeys',
  'keys',
  'apiTokens',
  'credentials',
  'secretKeys',
  'serviceTokens',
  'developerKeys',
  'api_keys',
  'externalKeys',
  'platformIntegrations',
  'integrationKeys',
  'thirdPartyTokens',
  // Additional storage keys to search
  'savedKeys',
  'userKeys',
  'appKeys',
  'cryptoKeys',
  'walletKeys',
  'dexKeys',
  'exchangeKeys',
  'tradingKeys',
  'apiKeyCollection',
  'tokenStorage',
  'accessKeys',
  'secretAccessKeys',
  'allKeys',
  'keyChain',
  'keyRing',
  'savedApiKeys',
  'appSecrets',
  'mainKeys',
  'backupKeys',
  'keyBackup',
  'authKeys',
  'persistedKeys',
  'web3Keys',
  'blockchainKeys',
  'systemKeys',
  'privateKeys',
  'publicKeys',
  'accountKeys',
  'keyStore',
  // Generic object storage names that might contain keys
  'data',
  'userData',
  'appData',
  'localStorage',
  'storage',
  'settings',
  'userSettings',
  'appSettings',
  'config',
  'userConfig',
  'appConfig',
  'preferences',
  'userPreferences',
  'appPreferences',
];

// Common passwords to try for decryption
const COMMON_PASSWORDS = [
  'password', 
  '123456', 
  'admin', 
  'master', 
  'apikey',
  'secret',
  'key',
  'vault',
  'secure',
  'api',
  'pass',
  'crypto',
  'wallet',
  'trading',
  'exchange',
  'binance',
  'solana',
  'blockchain',
];

// Search through all localStorage entries for potential API keys, even if they're not in a known format
const searchAllLocalStorage = (): ApiKey[] => {
  const potentialKeys: ApiKey[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const storageKey = localStorage.key(i);
    if (!storageKey) continue;
    
    try {
      const storedData = localStorage.getItem(storageKey);
      if (!storedData) continue;
      
      // Pattern for API key-like strings (long alphanumeric strings)
      const keyPattern = /[a-zA-Z0-9_-]{20,}/g;
      const foundKeys = storedData.match(keyPattern);
      
      if (foundKeys && foundKeys.length > 0) {
        for (const keyValue of foundKeys) {
          // Basic validation - skip if it's too long to be a reasonable API key
          if (keyValue.length > 100) continue;
          
          potentialKeys.push({
            id: `recovered-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: `Recovered from ${storageKey}`,
            key: keyValue,
            service: 'unknown',
            createdAt: new Date().toISOString(),
            description: `Automatically recovered from localStorage key: ${storageKey}`,
            isWorking: undefined,
            status: 'active',
            source: storageKey
          });
        }
      }
    } catch (e) {
      console.error(`Error scanning localStorage entry ${storageKey}:`, e);
    }
  }
  
  return potentialKeys;
};

// New function to recover keys from all possible storages
export const recoverAllApiKeys = (): { 
  recoveredKeys: ApiKey[], 
  locations: { storageKey: string, count: number }[] 
} => {
  const allRecoveredKeys: ApiKey[] = [];
  const recoveryLocations: { storageKey: string, count: number }[] = [];
  let totalKeysFound = 0;
  
  console.log(`Starting deep scan for API keys in ${POTENTIAL_STORAGE_KEYS.length} potential locations...`);
  toast.loading("Πραγματοποιείται πλήρης ανάκτηση κλειδιών...");

  // Scan all predefined storage locations
  for (const storageKey of POTENTIAL_STORAGE_KEYS) {
    const storedData = localStorage.getItem(storageKey);
    if (!storedData) continue;
    
    try {
      // Try parsing as regular JSON
      let parsedData;
      try {
        parsedData = JSON.parse(storedData);
      } catch (e) {
        // Try decrypting with known passwords then parsing
        let decryptedData = null;
        
        for (const pass of COMMON_PASSWORDS) {
          try {
            const decrypted = CryptoJS.AES.decrypt(storedData, pass).toString(CryptoJS.enc.Utf8);
            if (decrypted && (decrypted.startsWith('[') || decrypted.startsWith('{'))) {
              parsedData = JSON.parse(decrypted);
              console.log(`Successfully decrypted ${storageKey} with key "${pass}"`);
              break;
            }
          } catch (decryptError) {
            // Just continue to next password
          }
        }
        
        if (!parsedData) {
          console.log(`Failed to parse/decrypt ${storageKey}`);
          continue;
        }
      }
      
      // Handle both array and object formats
      let itemsToProcess = [];
      if (Array.isArray(parsedData)) {
        itemsToProcess = parsedData;
      } else if (typeof parsedData === 'object' && parsedData !== null) {
        // If it's an object, try to find arrays of objects or individual key objects
        for (const key in parsedData) {
          if (Array.isArray(parsedData[key])) {
            itemsToProcess = itemsToProcess.concat(parsedData[key]);
          } else if (typeof parsedData[key] === 'object' && parsedData[key] !== null) {
            itemsToProcess.push(parsedData[key]);
          }
        }
        
        // If no arrays found, treat the root object as a potential key
        if (itemsToProcess.length === 0) {
          itemsToProcess = [parsedData];
        }
      }
      
      // Filter and convert to standardized ApiKey format
      const validKeys = itemsToProcess
        .filter(item => item && typeof item === 'object')
        .map(item => {
          // Find potential key fields
          const keyValue = 
            item.key || 
            item.apiKey || 
            item.token || 
            item.secret || 
            item.value || 
            item.access_key || 
            item.api_key || 
            item.access_token || 
            item.accessToken || 
            item.apiToken || 
            '';
          
          // Find potential name fields
          const keyName = 
            item.name || 
            item.title || 
            item.label || 
            item.description || 
            item.service || 
            item.provider || 
            item.platform || 
            'Recovered key';
          
          // Find potential service fields
          const keyService = 
            item.service || 
            item.provider || 
            item.platform || 
            item.type || 
            item.source || 
            item.app || 
            item.application || 
            'other';
          
          if (!keyValue) return null;
          
          return {
            id: item.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: keyName,
            key: keyValue,
            service: keyService,
            createdAt: item.createdAt || item.created || item.timestamp || item.date || new Date().toISOString(),
            description: item.description || item.notes || item.comment || '',
            isWorking: typeof item.isWorking === 'boolean' ? item.isWorking : undefined,
            status: item.status || item.state || 'active',
            expires: item.expires || item.expiry || item.expiresAt || '',
            source: storageKey
          } as ApiKey;
        })
        .filter((key): key is ApiKey => key !== null);
      
      if (validKeys.length > 0) {
        console.log(`Recovered ${validKeys.length} keys from ${storageKey}`);
        allRecoveredKeys.push(...validKeys);
        recoveryLocations.push({ storageKey, count: validKeys.length });
        totalKeysFound += validKeys.length;
      }
    } catch (e) {
      console.error(`Error processing ${storageKey}:`, e);
    }
  }
  
  // Look for other potential keys in unknown locations
  const additionalLocations = diagnosticScanStorage();
  
  for (const location of additionalLocations) {
    // Skip locations we've already checked
    if (POTENTIAL_STORAGE_KEYS.includes(location.storageKey)) continue;
    
    const storedData = localStorage.getItem(location.storageKey);
    if (!storedData) continue;
    
    try {
      const parsedData = JSON.parse(storedData);
      
      let itemsToProcess = [];
      if (Array.isArray(parsedData)) {
        itemsToProcess = parsedData;
      } else if (typeof parsedData === 'object' && parsedData !== null) {
        // Check if the object has properties that could be arrays of keys
        for (const key in parsedData) {
          if (Array.isArray(parsedData[key])) {
            itemsToProcess = itemsToProcess.concat(parsedData[key]);
          }
        }
        
        // If no arrays found, use the object itself
        if (itemsToProcess.length === 0) {
          itemsToProcess = [parsedData];
        }
      }
      
      const validKeys = itemsToProcess
        .filter(item => item && typeof item === 'object')
        .map(item => {
          const keyValue = 
            item.key || 
            item.apiKey || 
            item.token || 
            item.secret || 
            item.value || 
            item.access_key || 
            item.api_key ||
            item.access_token || 
            item.accessToken || 
            item.apiToken || 
            '';
            
          const keyName = 
            item.name || 
            item.title || 
            item.label || 
            item.description || 
            'Recovered key';
            
          const keyService = 
            item.service || 
            item.provider || 
            item.platform || 
            item.type || 
            'other';
          
          if (!keyValue) return null;
          
          return {
            id: item.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: keyName,
            key: keyValue,
            service: keyService,
            createdAt: item.createdAt || item.created || new Date().toISOString(),
            description: item.description || item.notes || '',
            isWorking: typeof item.isWorking === 'boolean' ? item.isWorking : undefined,
            status: item.status || 'active',
            expires: item.expires || item.expiry || '',
            source: location.storageKey
          } as ApiKey;
        })
        .filter((key): key is ApiKey => key !== null);
      
      if (validKeys.length > 0) {
        console.log(`Recovered ${validKeys.length} keys from ${location.storageKey}`);
        allRecoveredKeys.push(...validKeys);
        recoveryLocations.push({ storageKey: location.storageKey, count: validKeys.length });
        totalKeysFound += validKeys.length;
      }
    } catch (e) {
      console.error(`Error processing ${location.storageKey}:`, e);
    }
  }
  
  // Also try the brute force extraction of API key-like strings
  const extractedKeys = searchAllLocalStorage();
  if (extractedKeys.length > 0) {
    console.log(`Found ${extractedKeys.length} potential API keys via pattern matching`);
    allRecoveredKeys.push(...extractedKeys);
    recoveryLocations.push({ storageKey: 'pattern-extracted', count: extractedKeys.length });
    totalKeysFound += extractedKeys.length;
  }
  
  // Remove duplicate keys (based on the key value)
  const uniqueKeys: ApiKey[] = [];
  const seenKeys = new Set<string>();
  
  for (const apiKey of allRecoveredKeys) {
    if (!seenKeys.has(apiKey.key)) {
      seenKeys.add(apiKey.key);
      uniqueKeys.push(apiKey);
    }
  }
  
  toast.dismiss();
  console.log(`Total recovered ${uniqueKeys.length} unique keys from ${recoveryLocations.length} locations`);
  
  return {
    recoveredKeys: uniqueKeys,
    locations: recoveryLocations
  };
};

// Function to scan the contents of localStorage to recover API keys
export const forceScanForKeys = (): number => {
  const result = recoverAllApiKeys();
  
  if (result.recoveredKeys.length > 0) {
    // Store recovered keys directly to localStorage to ensure they're found on next load
    try {
      const existingKeysStr = localStorage.getItem('apiKeys');
      let existingKeys: ApiKey[] = [];
      
      if (existingKeysStr) {
        try {
          existingKeys = JSON.parse(existingKeysStr);
        } catch (e) {
          console.error('Error parsing existing keys', e);
        }
      }
      
      const allKeys = [...existingKeys, ...result.recoveredKeys];
      
      // Remove duplicates
      const uniqueKeys: ApiKey[] = [];
      const seenKeys = new Set<string>();
      
      for (const key of allKeys) {
        if (!seenKeys.has(key.key)) {
          seenKeys.add(key.key);
          uniqueKeys.push(key);
        }
      }
      
      localStorage.setItem('apiKeys', JSON.stringify(uniqueKeys));
      console.log(`Saved ${uniqueKeys.length} keys to localStorage`);
      
      return result.recoveredKeys.length;
    } catch (e) {
      console.error('Error saving recovered keys', e);
    }
  }
  
  return 0;
};

// Αντικαθιστούμε τη λειτουργία αυτόματης ανάκτησης με μια απλή συνάρτηση που δεν κάνει επαναφορτώσεις
export const initializeAutoRecovery = (): void => {
  // Απλώς καταγράφουμε στην κονσόλα ότι η αυτόματη ανάκτηση έχει απενεργοποιηθεί
  console.log('Auto-recovery is disabled to prevent page reloads');
  
  // Δεν εκτελούμε καμία αυτόματη ανάκτηση ή επαναφόρτωση
};

// Export for compatibility with existing code
export { POTENTIAL_STORAGE_KEYS, COMMON_PASSWORDS };
