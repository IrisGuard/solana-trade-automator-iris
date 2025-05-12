
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
    // Επιπλέον πρότυπα αναζήτησης
    /[A-Za-z0-9+/]{40,}/g, // Base64 encoded keys
    /pk_live_[a-zA-Z0-9]{24,}/g, // Stripe-like public keys
    /sk_live_[a-zA-Z0-9]{24,}/g, // Stripe-like secret keys
    /api[_-]key[=:]["']?([a-zA-Z0-9_-]{16,})["']?/g, // API key patterns
    /access[_-]token[=:]["']?([a-zA-Z0-9_-]{16,})["']?/g, // Access token patterns
    /secret[_-]key[=:]["']?([a-zA-Z0-9_-]{16,})["']?/g, // Secret key patterns
    /AKIA[A-Z0-9]{16}/g, // AWS access keys
    /ghp_[a-zA-Z0-9]{36}/g, // GitHub personal access tokens
    /AIza[0-9A-Za-z-_]{35}/g, // Google API keys
  ];
  
  // Βαθιά σάρωση όλων των καταχωρήσεων στο localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const storageKey = localStorage.key(i);
    if (!storageKey) continue;
    
    try {
      const storedData = localStorage.getItem(storageKey);
      if (!storedData) continue;
      
      // Δοκιμή αναζήτησης με όλα τα πρότυπα
      for (const pattern of keyPatterns) {
        const foundKeys = storedData.match(pattern);
        
        if (foundKeys && foundKeys.length > 0) {
          for (const keyValue of foundKeys) {
            // Παράλειψη αν έχει ήδη επεξεργαστεί ή είναι πολύ μεγάλο για να είναι λογικό
            if (processedKeys.has(keyValue) || keyValue.length > 500) continue;
            processedKeys.add(keyValue);
            
            // Προσπάθεια να μαντέψουμε την υπηρεσία από το storage key ή τη μορφή του κλειδιού
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
            else if (keyValue.startsWith('ghp_')) guessedService = 'github';
            else if (keyValue.startsWith('AKIA')) guessedService = 'aws';
            else if (keyValue.startsWith('AIza')) guessedService = 'google';
            else if (keyValue.startsWith('pk_live_') || keyValue.startsWith('sk_live_')) guessedService = 'stripe';
            
            // Δημιουργία εγγραφής κλειδιού API
            const keyId = `recovered-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const keyName = `Ανακτημένο από ${storageKey} (${guessedService})`;
            
            potentialKeys.push({
              id: keyId,
              name: keyName,
              key: keyValue,
              service: guessedService,
              createdAt: new Date().toISOString(),
              description: `Αυτόματα ανακτήθηκε από το localStorage: ${storageKey}`,
              isWorking: undefined,
              status: 'active',
              source: storageKey
            });
          }
        }
      }
      
      // Επιπρόσθετη προσπάθεια αποκρυπτογράφησης εάν μοιάζει με κρυπτογραφημένο JSON
      if (storedData.includes('==') && 
          (storedData.startsWith('U2F') || storedData.startsWith('eyJ'))) {
        try {
          // Δοκιμή αποκρυπτογράφησης με κοινούς κωδικούς
          for (const password of COMMON_PASSWORDS) {
            try {
              const decrypted = CryptoJS.AES.decrypt(storedData, password).toString(CryptoJS.enc.Utf8);
              if (decrypted && (decrypted.startsWith('[') || decrypted.startsWith('{'))) {
                console.log(`Επιτυχής αποκρυπτογράφηση με κωδικό "${password}"`);
                const parsedData = JSON.parse(decrypted);
                
                // Εξαγωγή κλειδιών από τα αποκρυπτογραφημένα δεδομένα
                if (Array.isArray(parsedData)) {
                  for (const item of parsedData) {
                    if (item && typeof item === 'object' && item.key && item.name) {
                      if (processedKeys.has(item.key)) continue;
                      processedKeys.add(item.key);
                      
                      potentialKeys.push({
                        id: item.id || `decrypted-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        name: item.name,
                        key: item.key,
                        service: item.service || 'unknown',
                        createdAt: item.createdAt || new Date().toISOString(),
                        description: `Αποκρυπτογραφήθηκε από ${storageKey}`,
                        isWorking: item.isWorking,
                        status: item.status || 'active',
                        source: `encrypted:${storageKey}`
                      });
                    }
                  }
                }
                
                break; // Σταματάμε μετά από επιτυχή αποκρυπτογράφηση
              }
            } catch (decryptError) {
              // Συνεχίζουμε με τον επόμενο κωδικό
            }
          }
        } catch (e) {
          // Αγνοούμε σφάλματα κατά την αποκρυπτογράφηση
        }
      }
    } catch (e) {
      console.error(`Error scanning localStorage entry ${storageKey}:`, e);
    }
  }
  
  // Εξαγωγή δεδομένων από το session storage επίσης
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const storageKey = sessionStorage.key(i);
      if (!storageKey) continue;
      
      const storedData = sessionStorage.getItem(storageKey);
      if (!storedData) continue;
      
      // Αναζήτηση με τα ίδια πρότυπα
      for (const pattern of keyPatterns) {
        const foundKeys = storedData.match(pattern);
        
        if (foundKeys && foundKeys.length > 0) {
          for (const keyValue of foundKeys) {
            if (processedKeys.has(keyValue) || keyValue.length > 500) continue;
            processedKeys.add(keyValue);
            
            let guessedService = 'unknown';
            if (keyValue.startsWith('sk-')) guessedService = 'openai';
            else if (keyValue.startsWith('ghp_')) guessedService = 'github';
            
            potentialKeys.push({
              id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: `Ανακτημένο από sessionStorage: ${storageKey}`,
              key: keyValue,
              service: guessedService,
              createdAt: new Date().toISOString(),
              description: `Αυτόματα ανακτήθηκε από το sessionStorage`,
              isWorking: undefined,
              status: 'active',
              source: `sessionStorage:${storageKey}`
            });
          }
        }
      }
    }
  } catch (e) {
    console.error('Σφάλμα κατά τη σάρωση του sessionStorage:', e);
  }
  
  // Επιστροφή όλων των πιθανών κλειδιών που βρέθηκαν
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
