
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
    updateKeyStatus,
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
  
  // Έλεγχος λειτουργικότητας κλειδιών
  const checkKeysFunctionality = useCallback(async () => {
    if (apiKeys.length === 0) return;
    
    toast.loading("Έλεγχος λειτουργικότητας κλειδιών...");
    
    try {
      const updatedKeys = [...apiKeys];
      let workingCount = 0;
      let nonWorkingCount = 0;
      
      for (let i = 0; i < updatedKeys.length; i++) {
        const key = updatedKeys[i];
        const isWorking = await testKeyFunctionality(key);
        
        if (key.isWorking !== isWorking) {
          updatedKeys[i] = { ...key, isWorking };
          if (isWorking) {
            workingCount++;
          } else {
            nonWorkingCount++;
          }
        }
      }
      
      setApiKeys(updatedKeys);
      
      if (workingCount > 0 || nonWorkingCount > 0) {
        toast.success(`Έλεγχος ολοκληρώθηκε: ${workingCount} λειτουργικά, ${nonWorkingCount} μη λειτουργικά κλειδιά`);
      } else {
        toast.success("Έλεγχος κλειδιών ολοκληρώθηκε");
      }
    } catch (error) {
      console.error("Σφάλμα κατά τον έλεγχο κλειδιών:", error);
      toast.error("Σφάλμα κατά τον έλεγχο κλειδιών");
    }
  }, [apiKeys, setApiKeys, testKeyFunctionality]);

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
    checkKeysFunctionality,
    
    // Βοηθητικές συναρτήσεις
    getFilteredKeys: () => filterKeys(apiKeys),
    getKeysByService: () => groupKeysByService(apiKeys)
  };
}
