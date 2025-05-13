
import { useEffect } from 'react';
import { ApiKey } from '../types';
import { toast } from 'sonner';
import { useStorageState } from './useStorageState';

export function useLocalStorageLoader(
  apiKeys: ApiKey[], 
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>,
  useDemoKeys: boolean = false
) {
  const { storageState, setStorageState, setLoading, setError } = useStorageState();

  // Φόρτωση κλειδιών από το localStorage κατά την εκκίνηση
  useEffect(() => {
    setLoading(true);
    
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
  }, [setApiKeys, setLoading, setStorageState, setError]);

  return {
    storageState
  };
}
