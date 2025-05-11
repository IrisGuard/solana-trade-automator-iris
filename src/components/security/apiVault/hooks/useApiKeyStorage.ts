
import { useEffect } from "react";
import { ApiKey } from "../types";
import { demoKeys } from "../data/demoKeys";

export function useApiKeyStorage(
  apiKeys: ApiKey[], 
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>
) {
  // Φόρτωση κλειδιών από το localStorage κατά την εκκίνηση
  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        // Βεβαιωνόμαστε ότι έχουμε έγκυρα δεδομένα
        if (Array.isArray(parsedKeys) && parsedKeys.length > 0) {
          console.log('Φορτώθηκαν κλειδιά από το localStorage:', parsedKeys.length);
          setApiKeys(parsedKeys);
        } else {
          console.log('Το localStorage δεν περιείχε έγκυρα κλειδιά, φόρτωση demo κλειδιών');
          setApiKeys(demoKeys);
          // Αποθηκεύουμε τα προεπιλεγμένα κλειδιά για μελλοντική χρήση
          localStorage.setItem('apiKeys', JSON.stringify(demoKeys));
        }
      } catch (e) {
        console.error('Σφάλμα φόρτωσης κλειδιών:', e);
        console.log('Φόρτωση demo κλειδιών λόγω σφάλματος');
        setApiKeys(demoKeys);
        localStorage.setItem('apiKeys', JSON.stringify(demoKeys));
      }
    } else {
      console.log('Δεν βρέθηκαν αποθηκευμένα κλειδιά, φόρτωση demo κλειδιών');
      setApiKeys(demoKeys);
      localStorage.setItem('apiKeys', JSON.stringify(demoKeys));
    }
  }, [setApiKeys]);

  // Αποθήκευση κλειδιών στο localStorage όποτε αλλάζουν
  useEffect(() => {
    if (apiKeys.length > 0) {
      console.log('Αποθήκευση', apiKeys.length, 'κλειδιών στο localStorage');
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    }
  }, [apiKeys]);
}
