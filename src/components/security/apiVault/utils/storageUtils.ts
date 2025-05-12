import { toast } from "sonner";
import { ApiKey } from "../types";
import { encryptData, decryptData } from "./encryptionUtils";
import { diagnosticScanStorage } from "./diagnosticUtils";

// Create a timestamp-based backup key
const getBackupKey = () => `apiKeys_backup_${new Date().getTime()}`;

// Save a backup copy of keys
const backupKeys = (keys: ApiKey[]) => {
  try {
    const backupKey = getBackupKey();
    localStorage.setItem(backupKey, JSON.stringify(keys));
    
    // Keep only last 5 backups
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('apiKeys_backup_')) {
        allKeys.push(key);
      }
    }
    
    if (allKeys.length > 5) {
      allKeys.sort();
      for (let i = 0; i < allKeys.length - 5; i++) {
        localStorage.removeItem(allKeys[i]);
      }
    }
    
    return true;
  } catch (e) {
    console.error('Error creating backup:', e);
    return false;
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
      
      // Try to read - if encrypted
      if (isEncryptionEnabled && savedMasterPassword) {
        try {
          // Try to decrypt
          const decryptedData = decryptData(savedKeys, savedMasterPassword);
          if (decryptedData) {
            parsedKeys = decryptedData;
            setIsLocked(false);
            console.log('Successfully decrypted and loaded keys');
          } else {
            setIsLocked(true);
            console.log('Failed to decrypt, vault locked');
            // Run diagnostic scan to find any keys but don't show notifications
            diagnosticScanStorage();
            return;
          }
        } catch (e) {
          console.error('Decryption error:', e);
          // If decryption fails, try to read keys as non-encrypted
          try {
            parsedKeys = JSON.parse(savedKeys);
            console.log('Found non-encrypted keys after decryption failure');
            setIsLocked(false);
          } catch (parseError) {
            console.error('Failed to parse as JSON:', parseError);
            setIsLocked(true);
            // Run diagnostic scan to find any keys but don't show notifications
            diagnosticScanStorage();
            return;
          }
        }
      } else {
        // Try to read as non-encrypted
        try {
          parsedKeys = JSON.parse(savedKeys);
          console.log('Successfully loaded non-encrypted keys');
        } catch (e) {
          // In case the stored data is encrypted but encryption is not enabled
          console.log('Trying decryption as loading as non-encrypted failed');
          if (savedMasterPassword) {
            try {
              const decryptedData = decryptData(savedKeys, savedMasterPassword);
              if (decryptedData) {
                parsedKeys = decryptedData;
                setIsLocked(false);
                console.log('Successfully decrypted keys after trial');
              } else {
                setIsLocked(true);
                console.error('Failed to decrypt after trial');
                // Run diagnostic scan to find any keys but don't show notifications
                diagnosticScanStorage();
                return;
              }
            } catch (e) {
              console.error('Final failure loading keys:', e);
              // Run diagnostic scan but don't show notifications
              diagnosticScanStorage();
              setIsLocked(false);
              return;
            }
          } else {
            console.error('Failed to load keys and no master password available:', e);
            // Run diagnostic scan but don't show notifications
            const foundItems = diagnosticScanStorage();
            
            if (foundItems.length > 0) {
              console.log(`Found ${foundItems.length} potential key storages but couldn't load them`);
            } else {
              console.log("Could not load keys. The stored file may be corrupted.");
            }
            return;
          }
        }
      }
      
      // Ensure all keys have the required fields
      const validKeys = parsedKeys.filter((key: any) => key && key.name && key.service && key.key)
        .map((key: ApiKey) => ({
          ...key,
          id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: key.createdAt || new Date().toISOString(),
          isWorking: typeof key.isWorking === 'boolean' ? key.isWorking : true,
          status: key.status || 'active'
        }));
      
      // Create a backup of successfully loaded keys
      backupKeys(validKeys);
      
      setApiKeys(validKeys);
      setIsLocked(false);
      
      if (parsedKeys.length !== validKeys.length) {
        console.warn(`${parsedKeys.length - validKeys.length} keys ignored due to invalid format`);
      }
      
      console.log(`Loaded ${validKeys.length} keys from localStorage`);
      
      if (validKeys.length === 0) {
        console.log("No valid keys found in vault");
        // Run diagnostic scan but don't show notifications
        diagnosticScanStorage();
      }
    } catch (e) {
      console.error('Error loading keys:', e);
      // Run diagnostic scan but don't show notifications
      diagnosticScanStorage();
    }
  } else {
    console.log('No saved keys found in localStorage[apiKeys]');
    // Run diagnostic scan but don't show notifications
    diagnosticScanStorage();
  }
};

// Save keys to localStorage with backup
export const saveKeysToStorage = (
  apiKeys: ApiKey[], 
  isEncryptionEnabled: boolean, 
  masterPassword: string
) => {
  try {
    // Always create a backup before saving
    backupKeys(apiKeys);
    
    let dataToStore;
    
    if (isEncryptionEnabled && masterPassword) {
      dataToStore = encryptData(apiKeys, masterPassword);
      console.log('Saved encrypted keys to localStorage');
    } else {
      dataToStore = JSON.stringify(apiKeys);
      console.log('Saved non-encrypted keys to localStorage');
    }
    
    localStorage.setItem('apiKeys', dataToStore);
    
    // Also save a redundant copy
    localStorage.setItem('apiKeys_redundant', dataToStore);
    
    return true;
  } catch (e) {
    console.error('Error saving keys:', e);
    return false;
  }
};

// Check if there is a more recent backup
export const checkForBackups = (): { found: boolean; backupKey?: string } => {
  try {
    const backups = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('apiKeys_backup_')) {
        backups.push(key);
      }
    }
    
    if (backups.length > 0) {
      // Sort by timestamp (newest first)
      backups.sort().reverse();
      return { found: true, backupKey: backups[0] };
    }
  } catch (e) {
    console.error('Error checking for backups:', e);
  }
  
  return { found: false };
};

// Restore from backup
export const restoreFromBackup = (backupKey: string): ApiKey[] | null => {
  try {
    const data = localStorage.getItem(backupKey);
    if (!data) return null;
    
    return JSON.parse(data);
  } catch (e) {
    console.error('Error restoring from backup:', e);
    return null;
  }
};

// Export for compatibility with existing code
export { recoverAllApiKeys } from './recoveryUtils';
