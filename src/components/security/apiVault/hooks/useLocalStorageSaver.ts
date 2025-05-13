
import { useEffect } from 'react';
import { ApiKey } from '../types';
import { toast } from 'sonner';

export function useLocalStorageSaver(apiKeys: ApiKey[]) {
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
}
