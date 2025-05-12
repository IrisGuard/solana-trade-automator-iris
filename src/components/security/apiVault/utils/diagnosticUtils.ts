
import { ApiKey } from "../types";
import { toast } from "sonner";

// Diagnostic utility to locate all keys in localStorage
export const diagnosticScanStorage = () => {
  console.log('Diagnostic scan of localStorage:');
  
  let foundApiKeys = false;
  const apiKeyLikeItems = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    try {
      const value = localStorage.getItem(key);
      if (!value) continue;
      
      // Check for API key-like patterns in the string itself
      const keyPattern = /[a-zA-Z0-9_-]{20,}/g;
      const potentialKeys = value.match(keyPattern);
      
      // Check if content contains API key-like patterns
      if (potentialKeys && potentialKeys.length > 0) {
        console.log(`Found ${potentialKeys.length} potential API key patterns in localStorage[${key}]`);
      }
      
      // Check if content looks like JSON
      if ((value.startsWith('[') || value.startsWith('{'))) {
        try {
          const parsed = JSON.parse(value);
          
          // Check if it's an array of objects that might be API keys
          if (Array.isArray(parsed) && parsed.length > 0 && 
              parsed[0] && typeof parsed[0] === 'object' &&
              (parsed[0].key || parsed[0].apiKey || parsed[0].token || parsed[0].secret || parsed[0].value)) {
            console.log(`Potential API keys found in localStorage[${key}], count: ${parsed.length}`);
            apiKeyLikeItems.push({ 
              storageKey: key, 
              count: parsed.length,
              sample: parsed.slice(0, 3),
            });
            foundApiKeys = true;
          }
          // Check if it's an object with arrays of API keys
          else if (!Array.isArray(parsed) && typeof parsed === 'object' && parsed !== null) {
            for (const prop in parsed) {
              if (Array.isArray(parsed[prop]) && parsed[prop].length > 0 && 
                  typeof parsed[prop][0] === 'object' && 
                  (parsed[prop][0].key || parsed[prop][0].apiKey || 
                   parsed[prop][0].token || parsed[prop][0].secret || parsed[prop][0].value)) {
                console.log(`Potential API keys found in localStorage[${key}].${prop}, count: ${parsed[prop].length}`);
                apiKeyLikeItems.push({ 
                  storageKey: key, 
                  property: prop,
                  count: parsed[prop].length,
                  sample: parsed[prop].slice(0, 3),
                });
                foundApiKeys = true;
              }
            }
          }
          // Check if it's a simple object that might be a single API key
          else if (!Array.isArray(parsed) && typeof parsed === 'object' && parsed !== null) {
            if (parsed.key || parsed.apiKey || parsed.token || parsed.secret || parsed.value) {
              console.log(`Potential single API key found in localStorage[${key}]`);
              apiKeyLikeItems.push({ 
                storageKey: key, 
                count: 1,
                sample: [parsed],
              });
              foundApiKeys = true;
            }
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      }
    } catch (e) {
      console.error(`Error reading localStorage[${key}]:`, e);
    }
  }
  
  if (foundApiKeys) {
    console.log('Found potential API key storages:', apiKeyLikeItems);
    return apiKeyLikeItems;
  } else {
    console.log('No potential API keys found in localStorage');
    return [];
  }
};

// Function to extract all keys from localStorage based on common patterns
export const extractAllKeysFromStorage = (): ApiKey[] => {
  const extractedKeys: ApiKey[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const storageKey = localStorage.key(i);
    if (!storageKey) continue;
    
    try {
      const value = localStorage.getItem(storageKey);
      if (!value) continue;
      
      // Look for API key-like patterns in the string
      const keyPattern = /[a-zA-Z0-9_-]{20,}/g;
      const potentialKeys = value.match(keyPattern);
      
      if (potentialKeys && potentialKeys.length > 0) {
        for (const keyValue of potentialKeys) {
          // Skip if too long or too short
          if (keyValue.length < 20 || keyValue.length > 100) continue;
          
          extractedKeys.push({
            id: `extracted-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: `Key from ${storageKey}`,
            key: keyValue,
            service: 'unknown',
            createdAt: new Date().toISOString(),
            description: `Extracted from ${storageKey}`,
            isWorking: undefined,
            status: 'active',
            source: `extract:${storageKey}`
          });
        }
      }
    } catch (e) {
      console.error(`Error extracting keys from ${storageKey}:`, e);
    }
  }
  
  return extractedKeys;
};

// Function to manually inject test/demo keys for development and testing
export const injectDemoKeys = (count: number = 5): void => {
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
    
    const services = [
      'binance', 'solana', 'ethereum', 'kraken', 'coinbase', 'metamask', 
      'phantom', 'wallet', 'rork', 'explorer', 'api', 'exchange'
    ];
    
    const newKeys: ApiKey[] = [];
    
    for (let i = 0; i < count; i++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const key = `demo${i+1}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      newKeys.push({
        id: `demo-${Date.now()}-${i}`,
        name: `${service.charAt(0).toUpperCase() + service.slice(1)} Demo Key ${i+1}`,
        key: key,
        service: service,
        createdAt: new Date().toISOString(),
        description: `Demo key for testing - ${service}`,
        isWorking: Math.random() > 0.2, // 80% chance of working
        status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'expired' : 'revoked') : 'active',
        source: 'demo'
      });
    }
    
    const allKeys = [...existingKeys, ...newKeys];
    localStorage.setItem('apiKeys', JSON.stringify(allKeys));
    
    toast.success(`Προστέθηκαν ${count} δοκιμαστικά κλειδιά για επίδειξη`);
    console.log(`Injected ${count} demo keys into localStorage`);
    
    // Reload the page to show the new keys
    setTimeout(() => window.location.reload(), 1000);
  } catch (e) {
    console.error('Error injecting demo keys', e);
    toast.error('Σφάλμα κατά την προσθήκη δοκιμαστικών κλειδιών');
  }
};
