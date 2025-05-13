
import { useState, useEffect, useCallback } from "react";
import { ApiKey } from "../types";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface ApiKeyStorageState {
  isLoading: boolean;
  error: string | null;
  hasBackupData: boolean;
}

export function useApiKeyStorage(
  apiKeys: ApiKey[], 
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>,
  useDemoKeys: boolean = false
) {
  const [storageState, setStorageState] = useState<ApiKeyStorageState>({
    isLoading: true,
    error: null,
    hasBackupData: false
  });

  // Φόρτωση κλειδιών από το localStorage κατά την εκκίνηση
  useEffect(() => {
    setStorageState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      const backupKeys = localStorage.getItem('apiKeys_redundant');
      let backupAvailable = false;
      
      if (!savedKeys && !backupKeys) {
        console.log('Δεν βρέθηκαν αποθηκευμένα κλειδιά');
        setStorageState({ isLoading: false, error: null, hasBackupData: false });
        return;
      }
      
      // Try primary storage first
      if (savedKeys) {
        try {
          const parsedKeys = JSON.parse(savedKeys);
          
          if (Array.isArray(parsedKeys) && parsedKeys.length > 0) {
            console.log(`Φορτώθηκαν ${parsedKeys.length} κλειδιά από το localStorage`);
            
            // Validate keys before setting them
            const validKeys = parsedKeys
              .filter((key: any) => key && typeof key === 'object' && key.name && key.service && key.key)
              .map((key: ApiKey) => ({
                ...key,
                id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                createdAt: key.createdAt || new Date().toISOString(),
                status: key.status || 'active'
              }));
            
            if (validKeys.length > 0) {
              setApiKeys(validKeys);
              setStorageState({ isLoading: false, error: null, hasBackupData: false });
              return;
            } else {
              console.warn('Δεν βρέθηκαν έγκυρα κλειδιά στα αποθηκευμένα δεδομένα');
              backupAvailable = true;
            }
          } else {
            console.log('Τα αποθηκευμένα κλειδιά δεν είναι σε έγκυρη μορφή');
            backupAvailable = true;
          }
        } catch (parseError) {
          console.error('Σφάλμα ανάλυσης JSON:', parseError);
          backupAvailable = true;
        }
      }
      
      // If primary storage failed, try backup
      if (backupAvailable && backupKeys) {
        try {
          const parsedBackupKeys = JSON.parse(backupKeys);
          
          if (Array.isArray(parsedBackupKeys) && parsedBackupKeys.length > 0) {
            console.log(`Χρήση ${parsedBackupKeys.length} εφεδρικών κλειδιών`);
            
            // Validate backup keys
            const validBackupKeys = parsedBackupKeys
              .filter((key: any) => key && typeof key === 'object' && key.name && key.service && key.key)
              .map((key: ApiKey) => ({
                ...key,
                id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                createdAt: key.createdAt || new Date().toISOString(),
                status: key.status || 'active'
              }));
            
            if (validBackupKeys.length > 0) {
              setApiKeys(validBackupKeys);
              toast.warning("Χρησιμοποιούνται εφεδρικά κλειδιά λόγω σφάλματος στην κύρια αποθήκη");
              setStorageState({ isLoading: false, error: "Ανακτήθηκαν εφεδρικά κλειδιά", hasBackupData: true });
              
              // Restore backup to primary storage
              localStorage.setItem('apiKeys', JSON.stringify(validBackupKeys));
              return;
            }
          }
        } catch (backupError) {
          console.error('Σφάλμα ανάκτησης εφεδρικών κλειδιών:', backupError);
        }
      }
      
      setStorageState({ 
        isLoading: false, 
        error: "Δεν ήταν δυνατή η ανάκτηση έγκυρων κλειδιών από την αποθήκευση", 
        hasBackupData: false 
      });
    } catch (e) {
      console.error('Γενικό σφάλμα φόρτωσης κλειδιών:', e);
      setStorageState({ 
        isLoading: false, 
        error: "Υπήρξε σφάλμα κατά τη φόρτωση των κλειδιών", 
        hasBackupData: false 
      });
    }
  }, [setApiKeys]);

  // Αποθήκευση κλειδιών στο localStorage όποτε αλλάζουν
  useEffect(() => {
    if (apiKeys.length > 0) {
      try {
        console.log('Αποθήκευση', apiKeys.length, 'κλειδιών στο localStorage');
        localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
        
        // Always create a redundant backup
        localStorage.setItem('apiKeys_redundant', JSON.stringify(apiKeys));
      } catch (storageError) {
        console.error('Σφάλμα αποθήκευσης κλειδιών:', storageError);
        toast.error("Σφάλμα αποθήκευσης κλειδιών");
      }
    }
  }, [apiKeys]);

  // Προσθήκη νέας μεθόδου για δοκιμή λειτουργικότητας κλειδιών
  const testKeyFunctionality = useCallback(async (key: ApiKey): Promise<boolean> => {
    try {
      // Απλή προσομοίωση ελέγχου - στην πραγματικότητα θα έπρεπε να γίνει κλήση στο API
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true); // Όλα τα κλειδιά θεωρούνται λειτουργικά
        }, 300);
      });
    } catch (testError) {
      console.error('Σφάλμα δοκιμής κλειδιού:', testError);
      return false;
    }
  }, []);

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

  // Render error state component
  const renderErrorState = useCallback(() => {
    if (storageState.error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {storageState.error}
            {storageState.hasBackupData && " (Χρησιμοποιούνται εφεδρικά δεδομένα)"}
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }, [storageState.error, storageState.hasBackupData]);

  return {
    testKeyFunctionality,
    recoverFromBackup,
    storageState,
    renderErrorState
  };
}
