
import { ApiKey } from "../types";
import CryptoJS from "crypto-js";
import { COMMON_PASSWORDS, normalizeServiceName } from "./recoveryCore";
import { diagnosticScanStorage } from "./diagnosticUtils";

// Advanced function to search through all localStorage entries with improved heuristics
export const searchAllLocalStorage = (): ApiKey[] => {
  const potentialKeys: ApiKey[] = [];
  const processedKeys = new Set<string>(); // Track keys we've already processed
  
  // Deeper search patterns for common API key formats
  const keyPatterns = [
    /[a-zA-Z0-9_-]{20,}/g, // Basic long alphanumeric pattern
    /sk-[a-zA-Z0-9]{20,}/g, // OpenAI-style secret keys
    /SB[a-zA-Z0-9]{20,}/g, // Supabase anon keys
    /ey[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/g, // JWT tokens
    /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}/g, // UUID format keys
  ];
  
  for (let i = 0; i < localStorage.length; i++) {
    const storageKey = localStorage.key(i);
    if (!storageKey) continue;
    
    try {
      const storedData = localStorage.getItem(storageKey);
      if (!storedData) continue;
      
      // Search using multiple patterns
      for (const pattern of keyPatterns) {
        const foundKeys = storedData.match(pattern);
        
        if (foundKeys && foundKeys.length > 0) {
          for (const keyValue of foundKeys) {
            // Skip if already processed or too long to be reasonable
            if (processedKeys.has(keyValue) || keyValue.length > 500) continue;
            processedKeys.add(keyValue);
            
            // Try to guess the service from the storage key or key format
            let guessedService = 'unknown';
            if (storageKey.toLowerCase().includes('binance')) guessedService = 'binance';
            else if (storageKey.toLowerCase().includes('solana')) guessedService = 'solana';
            else if (storageKey.toLowerCase().includes('ethereum') || storageKey.toLowerCase().includes('eth')) guessedService = 'ethereum';
            else if (storageKey.toLowerCase().includes('openai')) guessedService = 'openai';
            else if (storageKey.toLowerCase().includes('kraken')) guessedService = 'kraken';
            else if (storageKey.toLowerCase().includes('coinbase')) guessedService = 'coinbase';
            else if (storageKey.toLowerCase().includes('rork')) guessedService = 'rork';
            
            // Format-based guessing
            if (keyValue.startsWith('sk-')) guessedService = 'openai';
            else if (keyValue.startsWith('SB')) guessedService = 'supabase';
            
            potentialKeys.push({
              id: `recovered-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: `Recovered from ${storageKey}`,
              key: keyValue,
              service: guessedService,
              createdAt: new Date().toISOString(),
              description: `Automatically recovered from localStorage key: ${storageKey}`,
              isWorking: undefined,
              status: 'active',
              source: storageKey
            });
          }
        }
      }
    } catch (e) {
      console.error(`Error scanning localStorage entry ${storageKey}:`, e);
    }
  }
  
  return potentialKeys;
};

// Function to attempt decoding encrypted data with common passwords
export const tryDecryptWithCommonPasswords = (storedData: string): any | null => {
  // First try as plain JSON
  try {
    return JSON.parse(storedData);
  } catch (e) {
    // Not JSON, try decrypting with known passwords
    for (const pass of COMMON_PASSWORDS) {
      try {
        const decrypted = CryptoJS.AES.decrypt(storedData, pass).toString(CryptoJS.enc.Utf8);
        if (decrypted && (decrypted.startsWith('[') || decrypted.startsWith('{'))) {
          console.log(`Successfully decrypted with key "${pass}"`);
          return JSON.parse(decrypted);
        }
      } catch (decryptError) {
        // Just continue to next password
      }
    }
  }
  return null;
};

// Process parsed data to extract API keys
export const extractApiKeysFromData = (
  parsedData: any, 
  processedKeys: Set<string>, 
  storageKey: string
): ApiKey[] => {
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
  return itemsToProcess
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
      
      // Skip if we've already processed this key or if the key is empty
      if (!keyValue || processedKeys.has(keyValue)) return null;
      processedKeys.add(keyValue);
      
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
      let keyService = 
        item.service || 
        item.provider || 
        item.platform || 
        item.type || 
        item.source || 
        item.app || 
        item.application || 
        'other';
      
      // Normalize service name
      keyService = normalizeServiceName(keyService);
      
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
};

// Process an individual storage key to extract API keys
export const processStorageKey = (
  storageKey: string, 
  processedKeys: Set<string>
): { keys: ApiKey[], success: boolean } => {
  const storedData = localStorage.getItem(storageKey);
  if (!storedData) return { keys: [], success: false };
  
  try {
    const parsedData = tryDecryptWithCommonPasswords(storedData);
    if (!parsedData) return { keys: [], success: false };
    
    const extractedKeys = extractApiKeysFromData(parsedData, processedKeys, storageKey);
    return { 
      keys: extractedKeys, 
      success: extractedKeys.length > 0 
    };
  } catch (e) {
    console.error(`Error processing ${storageKey}:`, e);
    return { keys: [], success: false };
  }
};
