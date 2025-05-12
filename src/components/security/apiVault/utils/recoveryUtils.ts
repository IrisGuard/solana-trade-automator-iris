
import { ApiKey } from "../types";
import CryptoJS from "crypto-js";
import { diagnosticScanStorage } from "./diagnosticUtils";

// New function to recover keys from all possible storages
export const recoverAllApiKeys = (): { 
  recoveredKeys: ApiKey[], 
  locations: { storageKey: string, count: number }[] 
} => {
  const allRecoveredKeys: ApiKey[] = [];
  const recoveryLocations: { storageKey: string, count: number }[] = [];
  
  // All potential storage key names
  const potentialStorageKeys = [
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
    'thirdPartyTokens'
  ];

  // Scan all storage locations
  for (const storageKey of potentialStorageKeys) {
    const storedData = localStorage.getItem(storageKey);
    if (!storedData) continue;
    
    try {
      // Try parsing as regular JSON
      let parsedData;
      try {
        parsedData = JSON.parse(storedData);
      } catch (e) {
        // Try decrypting with known passwords then parsing
        const commonPasswords = ['password', '123456', 'admin', 'master', 'apikey'];
        let decryptedData = null;
        
        for (const pass of commonPasswords) {
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
      
      if (!Array.isArray(parsedData)) {
        console.log(`${storageKey} does not contain an array`);
        continue;
      }
      
      // Filter and convert to standardized ApiKey format
      const validKeys = parsedData
        .filter(item => item && typeof item === 'object')
        .map(item => {
          const keyValue = item.key || item.apiKey || item.token || item.secret || item.value || '';
          const keyName = item.name || item.title || item.label || item.description || 'Recovered key';
          const keyService = item.service || item.provider || item.platform || item.type || 'other';
          
          if (!keyValue || !keyName) return null;
          
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
            source: storageKey
          } as ApiKey;
        })
        .filter((key): key is ApiKey => key !== null);
      
      if (validKeys.length > 0) {
        console.log(`Recovered ${validKeys.length} keys from ${storageKey}`);
        allRecoveredKeys.push(...validKeys);
        recoveryLocations.push({ storageKey, count: validKeys.length });
      }
    } catch (e) {
      console.error(`Error processing ${storageKey}:`, e);
    }
  }
  
  // Look for other potential keys in unknown locations
  const additionalLocations = diagnosticScanStorage();
  
  for (const location of additionalLocations) {
    // Skip locations we've already checked
    if (potentialStorageKeys.includes(location.storageKey)) continue;
    
    const storedData = localStorage.getItem(location.storageKey);
    if (!storedData) continue;
    
    try {
      const parsedData = JSON.parse(storedData);
      if (!Array.isArray(parsedData)) continue;
      
      const validKeys = parsedData
        .filter(item => item && typeof item === 'object')
        .map(item => {
          const keyValue = item.key || item.apiKey || item.token || item.secret || item.value || '';
          const keyName = item.name || item.title || item.label || item.description || 'Recovered key';
          const keyService = item.service || item.provider || item.platform || item.type || 'other';
          
          if (!keyValue || !keyName) return null;
          
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
      }
    } catch (e) {
      console.error(`Error processing ${location.storageKey}:`, e);
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
