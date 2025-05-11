
import { useState, useEffect } from "react";
import { useApiKeyOperations } from "./useApiKeyOperations";
import { useApiKeyFilters } from "./useApiKeyFilters";
import { useApiKeyVisibility } from "./useApiKeyVisibility";
import { useApiKeyStorage } from "./useApiKeyStorage";
import { demoKeys } from "../data/demoKeys";
import { ApiKey } from "../types";

export function useApiKeyManagement() {
  const [initialKeys, setInitialKeys] = useState<ApiKey[]>([]);
  const [useDemoKeysAsFallback, setUseDemoKeysAsFallback] = useState(false);
  
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
          // Ενεργοποίηση demo keys ως fallback αν δεν βρεθούν έγκυρα κλειδιά
          setUseDemoKeysAsFallback(true);
          console.log('Μη έγκυρα αποθηκευμένα κλειδιά, χρήση fallback');
        }
      } catch (e) {
        // Ενεργοποίηση demo keys ως fallback σε περίπτωση σφάλματος
        setUseDemoKeysAsFallback(true);
        console.error('Σφάλμα αρχικής φόρτωσης κλειδιών:', e);
      }
    } else {
      // Ενεργοποίηση demo keys αν δεν υπάρχουν αποθηκευμένα κλειδιά
      setUseDemoKeysAsFallback(true);
      console.log('Δεν βρέθηκαν αποθηκευμένα κλειδιά, έτοιμο για fallback');
    }
  }, []);

  // Βασικές λειτουργίες για τη διαχείριση των κλειδιών API
  const { apiKeys, setApiKeys, addNewKey, deleteKey, handleImport } = useApiKeyOperations(initialKeys);
  
  // Φίλτρα και αναζήτηση
  const { searchTerm, setSearchTerm, filterService, setFilterService, filterKeys, groupKeysByService } = useApiKeyFilters();
  
  // Διαχείριση ορατότητας
  const { isKeyVisible, toggleKeyVisibility } = useApiKeyVisibility();
  
  // Διαχείριση αποθήκευσης κλειδιών - με χρήση demo keys ως fallback μόνο αν είναι απαραίτητο
  useApiKeyStorage(apiKeys, setApiKeys, useDemoKeysAsFallback);
  
  // Εάν δεν υπάρχουν κλειδιά και έχει ενεργοποιηθεί το fallback, φορτώνουμε τα demo keys
  useEffect(() => {
    if (useDemoKeysAsFallback && apiKeys.length === 0) {
      console.log('Φόρτωση demo κλειδιών ως fallback');
      setApiKeys(demoKeys);
    }
  }, [useDemoKeysAsFallback, apiKeys.length, setApiKeys]);
  
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
    handleImport,
    
    // Βοηθητικές συναρτήσεις
    getFilteredKeys: () => filterKeys(apiKeys),
    getKeysByService: () => groupKeysByService(apiKeys)
  };
}
