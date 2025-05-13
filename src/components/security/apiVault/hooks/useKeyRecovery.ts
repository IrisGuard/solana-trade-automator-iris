
import { useCallback } from 'react';
import { ApiKey } from '../types';

export function useKeyRecovery() {
  // Μέθοδος για την ανάκτηση κλειδιών από τυχόν εφεδρικές πηγές
  const recoverFromBackup = useCallback(async (): Promise<ApiKey[]> => {
    try {
      // Check for backup sources
      const backupKeys = localStorage.getItem('apiKeys_redundant');
      const timestampedBackups = [];
      
      // Find all timestamped backups
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('apiKeys_backup_')) {
          timestampedBackups.push(key);
        }
      }
      
      // Sort backups by timestamp (most recent first)
      timestampedBackups.sort().reverse();
      
      // Try backup keys
      if (backupKeys) {
        try {
          const parsedBackupKeys = JSON.parse(backupKeys);
          if (Array.isArray(parsedBackupKeys) && parsedBackupKeys.length > 0) {
            return parsedBackupKeys;
          }
        } catch (e) {
          console.error('Error parsing backup keys:', e);
        }
      }
      
      // Try timestamped backups one by one
      for (const backupKey of timestampedBackups) {
        try {
          const backupData = localStorage.getItem(backupKey);
          if (backupData) {
            const parsedData = JSON.parse(backupData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              return parsedData;
            }
          }
        } catch (e) {
          console.error(`Error reading backup ${backupKey}:`, e);
        }
      }
      
      return [];
    } catch (e) {
      console.error('General error in recovery:', e);
      return [];
    }
  }, []);

  return {
    recoverFromBackup
  };
}
