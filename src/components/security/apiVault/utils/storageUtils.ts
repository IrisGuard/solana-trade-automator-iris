
import { toast } from "sonner";
import { ApiKey } from "../types";
import { encryptData, decryptData } from "./encryptionUtils";
import { diagnosticScanStorage } from "./diagnosticUtils";
import { recoverAllApiKeys } from "./recoveryUtils";

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
            // Run diagnostic scan to find any keys
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
            // Run diagnostic scan to find any keys
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
                // Run diagnostic scan to find any keys
                diagnosticScanStorage();
                return;
              }
            } catch (e) {
              console.error('Final failure loading keys:', e);
              // Run diagnostic scan to find any keys
              diagnosticScanStorage();
              setIsLocked(false);
              return;
            }
          } else {
            console.error('Failed to load keys and no master password available:', e);
            // Run diagnostic scan to find any keys
            const foundItems = diagnosticScanStorage();
            
            if (foundItems.length > 0) {
              toast.warning(`Found ${foundItems.length} potential key storages but couldn't load them`);
            } else {
              toast.error("Could not load keys. The stored file may be corrupted.");
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
      
      setApiKeys(validKeys);
      setIsLocked(false);
      
      if (parsedKeys.length !== validKeys.length) {
        console.warn(`${parsedKeys.length - validKeys.length} keys ignored due to invalid format`);
      }
      
      console.log(`Loaded ${validKeys.length} keys from localStorage`);
      
      if (validKeys.length === 0) {
        toast.warning("No valid keys found in vault");
        // Run diagnostic scan to find any keys
        diagnosticScanStorage();
      }
    } catch (e) {
      console.error('Error loading keys:', e);
      toast.error("Error loading keys");
      // Run diagnostic scan to find any keys
      diagnosticScanStorage();
    }
  } else {
    console.log('No saved keys found in localStorage[apiKeys]');
    // Run diagnostic scan to find any keys
    const foundItems = diagnosticScanStorage();
  }
};

// Save keys to localStorage
export const saveKeysToStorage = (
  apiKeys: ApiKey[], 
  isEncryptionEnabled: boolean, 
  masterPassword: string
) => {
  try {
    let dataToStore;
    
    if (isEncryptionEnabled && masterPassword) {
      dataToStore = encryptData(apiKeys, masterPassword);
      console.log('Saved encrypted keys to localStorage');
    } else {
      dataToStore = JSON.stringify(apiKeys);
      console.log('Saved non-encrypted keys to localStorage');
    }
    
    localStorage.setItem('apiKeys', dataToStore);
    return true;
  } catch (e) {
    console.error('Error saving keys:', e);
    toast.error("Error saving keys");
    return false;
  }
};

// Export for compatibility with existing code
export { recoverAllApiKeys };
