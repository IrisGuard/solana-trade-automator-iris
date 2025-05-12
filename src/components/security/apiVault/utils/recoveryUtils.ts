
import { ApiKey } from "../types";
import { toast } from "sonner";
import { 
  POTENTIAL_STORAGE_KEYS, 
  COMMON_PASSWORDS, 
  initializeAutoRecovery 
} from "./recoveryCore";
import { 
  searchAllLocalStorage, 
  processStorageKey 
} from "./storageScanner";
import { diagnosticScanStorage } from "./diagnosticUtils";

// Enhanced function to recover keys from all possible storages
export const recoverAllApiKeys = async (): Promise<{ 
  recoveredKeys: ApiKey[], 
  locations: { storageKey: string, count: number }[] 
}> => {
  const allRecoveredKeys: ApiKey[] = [];
  const recoveryLocations: { storageKey: string, count: number }[] = [];
  const processedKeys = new Set<string>(); // Track keys we've already processed
  
  console.log(`Starting deep scan for API keys in ${POTENTIAL_STORAGE_KEYS.length} potential locations...`);
  
  // First scan all predefined storage locations
  for (const storageKey of POTENTIAL_STORAGE_KEYS) {
    const { keys, success } = processStorageKey(storageKey, processedKeys);
    
    if (success && keys.length > 0) {
      console.log(`Recovered ${keys.length} keys from ${storageKey}`);
      allRecoveredKeys.push(...keys);
      recoveryLocations.push({ storageKey, count: keys.length });
    }
  }
  
  // Look for other potential keys in unknown locations
  const additionalLocations = diagnosticScanStorage();
  
  for (const location of additionalLocations) {
    // Skip locations we've already checked
    if (POTENTIAL_STORAGE_KEYS.includes(location.storageKey)) continue;
    
    const { keys, success } = processStorageKey(location.storageKey, processedKeys);
    
    if (success && keys.length > 0) {
      console.log(`Recovered ${keys.length} keys from ${location.storageKey}`);
      allRecoveredKeys.push(...keys);
      recoveryLocations.push({ storageKey: location.storageKey, count: keys.length });
    }
  }
  
  // Also try the brute force extraction of API key-like strings
  const extractedKeys = searchAllLocalStorage();
  if (extractedKeys.length > 0) {
    console.log(`Found ${extractedKeys.length} potential API keys via pattern matching`);
    
    // Filter out keys we've already processed
    const uniqueExtractedKeys = extractedKeys.filter(key => !processedKeys.has(key.key));
    
    if (uniqueExtractedKeys.length > 0) {
      allRecoveredKeys.push(...uniqueExtractedKeys);
      recoveryLocations.push({ storageKey: 'pattern-extracted', count: uniqueExtractedKeys.length });
    }
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
  
  console.log(`Total recovered ${uniqueKeys.length} unique keys from ${recoveryLocations.length} locations`);
  
  return {
    recoveredKeys: uniqueKeys,
    locations: recoveryLocations
  };
};

// Function to scan the contents of localStorage to recover API keys
export const forceScanForKeys = async (): Promise<number> => {
  const result = await recoverAllApiKeys();
  
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

// Export for compatibility with existing code
export { POTENTIAL_STORAGE_KEYS, COMMON_PASSWORDS, initializeAutoRecovery };
