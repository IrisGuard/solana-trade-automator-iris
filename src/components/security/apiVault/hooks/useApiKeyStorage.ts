
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
          console.log('Τα αποθηκευμένα κλειδιά δεν είναι έγκυρο JSON:', savedKeys);
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
              createdAt: key.createdAt || new Date().toISOString()
            }));
          
          if (validKeys.length > 0) {
            setApiKeys(validKeys);
            console.log(`${validKeys.length} έγκυρα κλειδιά φορτώθηκαν`);
            // Δεν φορτώνουμε demo κλειδιά αν βρήκαμε έγκυρα κλειδιά
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
    
    // Μόνο αν δεν βρέθηκαν κλειδιά στο localStorage και επιτρέπεται η χρήση demo κλειδιών
    if (useDemoKeys) {
      console.log('Προσπάθεια εύρεσης υπαρχόντων κλειδιών από παλαιότερες εκδόσεις αποθήκευσης');
      
      // Προσπάθεια ανάκτησης κλειδιών από άλλες πιθανές αποθηκεύσεις
      const alternateStorageKeys = [
        'api-keys', 
        'apikeyvault', 
        'secure-api-keys',
        'user-api-keys'
      ];
      
      for (const storageKey of alternateStorageKeys) {
        const altKeys = localStorage.getItem(storageKey);
        if (altKeys) {
          try {
            const altParsedKeys = JSON.parse(altKeys);
            if (Array.isArray(altParsedKeys) && altParsedKeys.length > 0) {
              console.log(`Βρέθηκαν ${altParsedKeys.length} κλειδιά στο εναλλακτικό storage: ${storageKey}`);
              setApiKeys(altParsedKeys.map((key: any) => ({
                ...key,
                id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                createdAt: key.createdAt || new Date().toISOString()
              })));
              // Αποθήκευση στο κύριο storage
              localStorage.setItem('apiKeys', JSON.stringify(altParsedKeys));
              toast.success(`Ανακτήθηκαν ${altParsedKeys.length} κλειδιά από προηγούμενη αποθήκευση`);
              return;
            }
          } catch (e) {
            console.error(`Σφάλμα ανάλυσης εναλλακτικού storage ${storageKey}:`, e);
          }
        }
      }
      
      // Σε περίπτωση που δεν βρέθηκαν κλειδιά, δεν κάνουμε τίποτα
      // Τα demo κλειδιά θα φορτωθούν από το useApiKeyManagement αν είναι απαραίτητο
    }
  }, [setApiKeys, useDemoKeys]);

  // Αποθήκευση κλειδιών στο localStorage όποτε αλλάζουν
  useEffect(() => {
    if (apiKeys.length > 0) {
      console.log('Αποθήκευση', apiKeys.length, 'κλειδιών στο localStorage');
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    }
  }, [apiKeys]);
}
