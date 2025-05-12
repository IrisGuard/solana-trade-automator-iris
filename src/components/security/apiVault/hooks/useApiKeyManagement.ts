
import { useState, useEffect, useCallback } from "react";
import { useApiKeyOperations } from "./useApiKeyOperations";
import { useApiKeyFilters } from "./useApiKeyFilters";
import { useApiKeyVisibility } from "./useApiKeyVisibility";
import { useApiKeyStorage } from "./useApiKeyStorage";
import { ApiKey } from "../types";
import { toast } from "sonner";
import { autoRestoreIfEmpty, forceScanForKeys } from "../utils";

export function useApiKeyManagement() {
  const [initialKeys, setInitialKeys] = useState<ApiKey[]>([]);
  const [hasRunRecovery, setHasRunRecovery] = useState(false);
  
  // Προσπάθεια ανάκτησης κλειδιών από το localStorage
  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        if (Array.isArray(parsedKeys) && parsedKeys.length > 0) {
          setInitialKeys(parsedKeys);
          console.log('Αρχική φόρτωση κλειδιών επιτυχής:', parsedKeys.length);
        } else {
          console.log('Δεν βρέθηκαν κλειδιά στην αρχική φόρτωση, έναρξη διαδικασίας ανάκτησης...');
          // Αν δεν υπάρχουν κλειδιά, προσπαθούμε να τα ανακτήσουμε
          autoRestoreIfEmpty();
        }
      } catch (e) {
        console.error('Σφάλμα αρχικής φόρτωσης κλειδιών:', e);
      }
    } else {
      console.log('Δεν βρέθηκε απόθεση κλειδιών, έναρξη διαδικασίας ανάκτησης...');
      // Αν δεν υπάρχουν κλειδιά, προσπαθούμε να τα ανακτήσουμε
      autoRestoreIfEmpty();
    }
  }, []);

  // Εκτέλεση επιπρόσθετης ανάκτησης αν χρειαστεί
  useEffect(() => {
    if (!hasRunRecovery) {
      const runRecovery = async () => {
        try {
          const savedKeys = localStorage.getItem('apiKeys');
          if (!savedKeys || JSON.parse(savedKeys).length === 0) {
            console.log('Εκτέλεση αυτόματης ανάκτησης...');
            await forceScanForKeys();
            
            // Έλεγχος αν βρέθηκαν κλειδιά μετά την ανάκτηση
            const recoveredKeys = localStorage.getItem('apiKeys');
            if (recoveredKeys) {
              try {
                const parsedKeys = JSON.parse(recoveredKeys);
                if (Array.isArray(parsedKeys) && parsedKeys.length > 0) {
                  console.log(`Η ανάκτηση βρήκε ${parsedKeys.length} κλειδιά`);
                  setInitialKeys(parsedKeys);
                }
              } catch (e) {
                console.error('Σφάλμα ανάλυσης ανακτημένων κλειδιών:', e);
              }
            }
          }
        } catch (e) {
          console.error('Σφάλμα στην αυτόματη ανάκτηση:', e);
        } finally {
          setHasRunRecovery(true);
        }
      };
      
      // Εκτέλεση με μικρή καθυστέρηση για να μην επηρεάσουμε το αρχικό φόρτωμα
      setTimeout(runRecovery, 1000);
    }
  }, [hasRunRecovery]);

  // Βασικές λειτουργίες για τη διαχείριση των κλειδιών API
  const { 
    apiKeys, 
    setApiKeys, 
    addNewKey, 
    deleteKey, 
    handleImport, 
    updateKey 
  } = useApiKeyOperations(initialKeys);
  
  // Φίλτρα και αναζήτηση
  const { 
    searchTerm, 
    setSearchTerm, 
    filterService, 
    setFilterService, 
    filterKeys, 
    groupKeysByService 
  } = useApiKeyFilters();
  
  // Διαχείριση ορατότητας
  const { isKeyVisible, toggleKeyVisibility } = useApiKeyVisibility();
  
  // Διαχείριση αποθήκευσης κλειδιών
  const { testKeyFunctionality } = useApiKeyStorage(apiKeys, setApiKeys, false);
  
  // Καθαρισμός αποθηκευμένων demo κλειδιών κατά την πρώτη φόρτωση
  useEffect(() => {
    // Αφαίρεση δείκτη των demo κλειδιών
    localStorage.removeItem('demoKeysInjected');
  }, []);
  
  return {
    // Κατάσταση των κλειδιών
    apiKeys,
    setApiKeys,
    
    // Διαχείριση ορατότητας
    isKeyVisible,
    toggleKeyVisibility,
    
    // Φίλτρα αναζήτησης
    searchTerm,
    setSearchTerm,
    filterService,
    setFilterService,
    
    // Λειτουργίες κλειδιών
    addNewKey,
    deleteKey,
    updateKey,
    handleImport,
    
    // Βοηθητικές συναρτήσεις
    getFilteredKeys: () => filterKeys(apiKeys),
    getKeysByService: () => groupKeysByService(apiKeys)
  };
}
