
import { ApiKey } from "../types";
import { POTENTIAL_STORAGE_KEYS } from "./recoveryCore";
import { saveKeysToStorage } from "./storageUtils";

// Recovery function to find all API keys in localStorage
export const recoverAllApiKeys = () => {
  console.log("Starting API key recovery...");
  const allStorageKeys = getAllStorageKeys();
  const recoveredKeys: ApiKey[] = [];
  const locationStats: { storageKey: string; count: number }[] = [];
  
  // First check known backup keys
  const backupKeys = allStorageKeys.filter(key => 
    key.startsWith("apiKeys_backup_") || 
    key === "apiKeys_redundant"
  );
  
  console.log(`Found ${backupKeys.length} potential backup keys`);
  
  // Then try to recover from known storage locations
  for (const storageKey of [...backupKeys, ...POTENTIAL_STORAGE_KEYS]) {
    try {
      const data = localStorage.getItem(storageKey);
      if (!data) continue;
      
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(data);
        
        // Check if it's an array of objects with known API key properties
        if (Array.isArray(parsed)) {
          const validKeys = parsed.filter(item => 
            item && 
            typeof item === 'object' && 
            (item.key || item.apiKey || item.token || item.secret) &&
            (item.name || item.service || item.provider)
          );
          
          if (validKeys.length > 0) {
            // Format keys properly
            const formattedKeys = validKeys.map(item => ({
              id: item.id || `recovered-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: item.name || item.service || 'Recovered Key',
              service: item.service || item.provider || detectServiceFromKey(item.key || item.apiKey || '') || 'unknown',
              key: item.key || item.apiKey || item.token || item.secret,
              connected: false,
              createdAt: item.createdAt || item.created || new Date().toISOString(),
              status: item.status === 'expired' ? 'expired' : 
                     item.status === 'revoked' ? 'revoked' : 
                     'active' as 'active' | 'expired' | 'revoked'
            }));
            
            // Add to recovered keys, avoid duplicates
            formattedKeys.forEach(newKey => {
              if (!recoveredKeys.some(existingKey => existingKey.key === newKey.key)) {
                recoveredKeys.push(newKey);
              }
            });
            
            locationStats.push({ 
              storageKey, 
              count: formattedKeys.length 
            });
            
            console.log(`Recovered ${formattedKeys.length} keys from ${storageKey}`);
          }
        }
      } catch (e) {
        // Not valid JSON
        console.log(`${storageKey} does not contain valid JSON`);
      }
    } catch (e) {
      console.error(`Error processing ${storageKey}:`, e);
    }
  }
  
  // Create a recovery backup of all found keys
  if (recoveredKeys.length > 0) {
    const backupKey = `apiKeys_recovery_${new Date().toISOString().replace(/[:.]/g, '-')}`;
    localStorage.setItem(backupKey, JSON.stringify(recoveredKeys));
    
    // Always save a canonical copy for future safety
    saveKeysToStorage(recoveredKeys, false, "");
    
    console.log(`Created recovery backup with ${recoveredKeys.length} keys`);
  }
  
  return {
    keys: recoveredKeys,
    locations: locationStats
  };
};

// Force recovery scan function
export const forceScanForKeys = (): ApiKey[] => {
  console.log("Performing forced scan for API keys...");
  const { keys } = recoverAllApiKeys();
  return keys;
};

// Helper functions

// Get a list of all localStorage keys
export const getAllStorageKeys = (): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) keys.push(key);
  }
  return keys;
};

// Check if a key belongs to a known service based on its format
export const detectServiceFromKey = (key: string): string | null => {
  if (!key) return null;
  
  // Common key patterns
  if (key.startsWith('sk-')) return 'openai';
  if (key.startsWith('pk_') || key.startsWith('sk_')) return 'stripe';
  if (key.startsWith('key-')) return 'sendgrid';
  if (key.startsWith('AKIA')) return 'aws';
  if (key.startsWith('ghp_')) return 'github';
  if (key.length >= 40 && /^[A-Za-z0-9]+$/.test(key)) return 'helius';
  
  return null;
};
