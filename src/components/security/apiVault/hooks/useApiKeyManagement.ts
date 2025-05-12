
import { useState, useEffect, useCallback } from "react";
import { useApiKeyOperations } from "./useApiKeyOperations";
import { useApiKeyFilters } from "./useApiKeyFilters";
import { useApiKeyVisibility } from "./useApiKeyVisibility";
import { useApiKeyStorage } from "./useApiKeyStorage";
import { ApiKey } from "../types";
import { toast } from "sonner";

export function useApiKeyManagement() {
  const [initialKeys, setInitialKeys] = useState<ApiKey[]>([]);
  
  // Προσπάθεια ανάκτησης κλειδιών από το localStorage
  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        if (Array.isArray(parsedKeys) && parsedKeys.length > 0) {
          setInitialKeys(parsedKeys);
          console.log('Αρχική φόρτωση κλειδιών επιτυχής:', parsedKeys.length);
        }
      } catch (e) {
        console.error('Σφάλμα αρχικής φόρτωσης κλειδιών:', e);
      }
    }
  }, []);

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
