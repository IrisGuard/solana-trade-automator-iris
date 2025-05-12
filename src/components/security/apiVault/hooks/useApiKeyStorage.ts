
import { useEffect } from "react";
import { ApiKey } from "../types";
import { toast } from "sonner";

export function useApiKeyStorage(
  apiKeys: ApiKey[], 
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>,
  useDemoKeys: boolean = false
) {
  // Φόρτωση κλειδιών από το localStorage κατά την εκκίνηση
  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    
    if (savedKeys) {
      try {
        let parsedKeys;
        try {
          parsedKeys = JSON.parse(savedKeys);
          console.log('Επιτυχής φόρτωση κλειδιών από το localStorage');
        } catch (e) {
          console.error('Σφάλμα ανάλυσης JSON:', e);
          return;
        }
        
        // Βεβαιωνόμαστε ότι έχουμε έγκυρα δεδομένα
        if (Array.isArray(parsedKeys) && parsedKeys.length > 0) {
          console.log(`Φορτώθηκαν ${parsedKeys.length} κλειδιά από το localStorage`);
          
          // Επιβεβαίωση ότι όλα τα κλειδιά έχουν τα απαραίτητα πεδία
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
            console.log(`${validKeys.length} έγκυρα κλειδιά φορτώθηκαν`);
            return;
          } else {
            console.warn('Δεν βρέθηκαν έγκυρα κλειδιά στα αποθηκευμένα δεδομένα');
          }
        } else {
          console.log('Δεν βρέθηκαν αποθηκευμένα κλειδιά ή η λίστα είναι κενή');
        }
      } catch (e) {
        console.error('Γενικό σφάλμα φόρτωσης κλειδιών:', e);
      }
    } else {
      console.log('Δεν βρέθηκαν αποθηκευμένα κλειδιά στο localStorage');
    }
  }, [setApiKeys]);

  // Αποθήκευση κλειδιών στο localStorage όποτε αλλάζουν
  useEffect(() => {
    if (apiKeys.length > 0) {
      console.log('Αποθήκευση', apiKeys.length, 'κλειδιών στο localStorage');
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    }
  }, [apiKeys]);

  // Προσθήκη νέας μεθόδου για δοκιμή λειτουργικότητας κλειδιών
  const testKeyFunctionality = async (key: ApiKey): Promise<boolean> => {
    // Απλή προσομοίωση ελέγχου - στην πραγματικότητα θα έπρεπε να γίνει κλήση στο API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // Όλα τα κλειδιά θεωρούνται λειτουργικά
      }, 300);
    });
  };

  return {
    testKeyFunctionality
  };
}
