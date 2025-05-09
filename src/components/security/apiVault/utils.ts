
import CryptoJS from "crypto-js";
import { ApiKey } from "./types";
import { toast } from "sonner";

// Format key display
export const maskKey = (key: string) => {
  if (key.length <= 8) return "•".repeat(key.length);
  return `${key.substring(0, 4)}${"•".repeat(key.length - 8)}${key.substring(key.length - 4)}`;
};

// Select service icon
export const getServiceIcon = (service: string) => {
  switch (service) {
    case 'supabase':
      return '🔷';
    case 'vercel':
      return '▲';
    case 'solana':
      return '◎';
    case 'aws':
      return '☁️';
    case 'github':
      return '🐙';
    case 'stripe':
      return '💳';
    case 'openai':
      return '🤖';
    case 'firebase':
      return '🔥';
    default:
      return '🔑';
  }
};

// Load keys from localStorage
export const loadKeysFromStorage = (
  isEncryptionEnabled: boolean, 
  savedMasterPassword: string,
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>,
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const savedKeys = localStorage.getItem('apiKeys');
  if (savedKeys) {
    try {
      let parsedKeys;
      
      if (isEncryptionEnabled && savedMasterPassword) {
        try {
          // Try to decrypt
          const decrypted = CryptoJS.AES.decrypt(savedKeys, savedMasterPassword).toString(CryptoJS.enc.Utf8);
          if (decrypted) {
            parsedKeys = JSON.parse(decrypted);
            setIsLocked(false);
          } else {
            setIsLocked(true);
            return;
          }
        } catch (e) {
          console.error('Σφάλμα αποκρυπτογράφησης:', e);
          setIsLocked(true);
          return;
        }
      } else {
        parsedKeys = JSON.parse(savedKeys);
      }
      
      setApiKeys(parsedKeys);
      setIsLocked(false);
    } catch (e) {
      console.error('Σφάλμα φόρτωσης κλειδιών:', e);
      toast.error("Σφάλμα φόρτωσης κλειδιών");
    }
  }
};

// Save keys to localStorage
export const saveKeysToStorage = (
  apiKeys: ApiKey[],
  isEncryptionEnabled: boolean,
  savedMasterPassword: string
) => {
  if (apiKeys.length > 0 || localStorage.getItem('apiKeys')) {
    let dataToStore;
    
    if (isEncryptionEnabled && savedMasterPassword) {
      // Encrypt data
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(apiKeys),
        savedMasterPassword
      ).toString();
      dataToStore = encrypted;
    } else {
      dataToStore = JSON.stringify(apiKeys);
    }
    
    localStorage.setItem('apiKeys', dataToStore);
  }
};

// Handle copying key to clipboard
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success("Το κλειδί αντιγράφηκε στο πρόχειρο");
    })
    .catch(() => {
      toast.error("Αποτυχία αντιγραφής στο πρόχειρο");
    });
};

// Parse different import formats
export const parseImportData = (importData: string, importFormat: string) => {
  let importedKeys: ApiKey[] = [];
  
  if (importFormat === 'json') {
    // Try to parse the data as JSON first
    try {
      const parsed = JSON.parse(importData);
      
      // Check if it's an array of objects with the required properties
      if (Array.isArray(parsed) && parsed.every(item => 
        typeof item === 'object' && item !== null && 'name' in item && 'key' in item
      )) {
        importedKeys = parsed.map(item => ({
          id: item.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
          name: item.name,
          key: item.key,
          service: item.service || 'other',
          createdAt: item.createdAt || new Date().toISOString(),
          description: item.description,
          expires: item.expires
        }));
      }
    } catch (e) {
      // If JSON parsing fails, check for key-value pairs in the format shown in the screenshot
      const lines = importData.trim().split('\n');
      
      for (const line of lines) {
        // Look for patterns like EXPO_PUBLIC_SOLANA_RPC_URL=https://...
        const keyValueMatch = line.match(/^([A-Z0-9_]+)=(.+)$/);
        if (keyValueMatch) {
          const name = keyValueMatch[1];
          const key = keyValueMatch[2];
          
          importedKeys.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name,
            key,
            service: name.toLowerCase().includes('solana') ? 'solana' : 'other',
            createdAt: new Date().toISOString()
          });
        }
      }
      
      // Also check for patterns like EXPO_PUBLIC_SOLANA_RPC_URL_1=https://...
      // This handles numbered entries like in the screenshot
      lines.forEach(line => {
        const numberedKeyMatch = line.match(/^([A-Z0-9_]+)_(\d+)=(.+)$/);
        if (numberedKeyMatch) {
          const baseName = numberedKeyMatch[1];
          const number = numberedKeyMatch[2];
          const key = numberedKeyMatch[3];
          
          importedKeys.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: `${baseName} ${number}`,
            key,
            service: baseName.toLowerCase().includes('solana') ? 'solana' : 'other',
            createdAt: new Date().toISOString()
          });
        }
      });
    }
  } else if (importFormat === 'text') {
    // Format: name|key|service|description (optional)
    const lines = importData.trim().split('\n');
    
    lines.forEach(line => {
      // First check for the pipe-delimited format
      if (line.includes('|')) {
        const parts = line.split('|');
        importedKeys.push({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          name: parts[0].trim(),
          key: parts[1].trim(),
          service: parts[2]?.trim() || 'other',
          createdAt: new Date().toISOString(),
          description: parts[3]?.trim(),
          expires: parts[4]?.trim()
        });
      } 
      // Then check for KEY=value format
      else {
        const keyValueMatch = line.match(/^([A-Z0-9_]+)=(.+)$/);
        if (keyValueMatch) {
          const name = keyValueMatch[1];
          const key = keyValueMatch[2];
          
          importedKeys.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name,
            key,
            service: name.toLowerCase().includes('solana') ? 'solana' : 'other',
            createdAt: new Date().toISOString()
          });
        }
        
        // Check for numbered KEY_#=value format
        const numberedKeyMatch = line.match(/^([A-Z0-9_]+)_(\d+)=(.+)$/);
        if (numberedKeyMatch) {
          const baseName = numberedKeyMatch[1];
          const number = numberedKeyMatch[2];
          const key = numberedKeyMatch[3];
          
          importedKeys.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: `${baseName} ${number}`,
            key,
            service: baseName.toLowerCase().includes('solana') ? 'solana' : 'other',
            createdAt: new Date().toISOString()
          });
        }
      }
    });
  }
  
  return importedKeys;
};
