import { ApiKey } from "../types";

// Create a timestamp-based backup key
export const getBackupKey = () => `apiKeys_backup_${new Date().getTime()}`;

// Save a backup copy of keys
export const backupKeys = (keys: ApiKey[]) => {
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
