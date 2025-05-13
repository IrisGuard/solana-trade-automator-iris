
import { ApiKey } from "../types";
import { encryptData } from "./encryptionUtils";
import { backupKeys } from "./backupUtils";

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
