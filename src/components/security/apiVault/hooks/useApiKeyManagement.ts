
import { useState, useEffect, useCallback } from "react";
import { useApiKeyOperations } from "./useApiKeyOperations";
import { useApiKeyFilters } from "./useApiKeyFilters";
import { useApiKeyVisibility } from "./useApiKeyVisibility";
import { useApiKeyStorage } from "./useApiKeyStorage";
import { demoKeys } from "../data/demoKeys";
import { ApiKey } from "../types";
import { toast } from "sonner";

export function useApiKeyManagement() {
  const [initialKeys, setInitialKeys] = useState<ApiKey[]>([]);
  const [useDemoKeysAsFallback, setUseDemoKeysAsFallback] = useState(false);
  const [isTestingKeys, setIsTestingKeys] = useState(false);
  
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
  
  // Διαχείριση αποθήκευσης κλειδιών - με χρήση demo keys ως fallback μόνο αν είναι απαραίτητο
  const { testKeyFunctionality } = useApiKeyStorage(apiKeys, setApiKeys, useDemoKeysAsFallback);
  
  // Έλεγχος λειτουργικότητας κλειδιών
  const checkKeysFunctionality = useCallback(async () => {
    if (apiKeys.length === 0 || isTestingKeys) return;
    
    setIsTestingKeys(true);
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
    } finally {
      setIsTestingKeys(false);
    }
  }, [apiKeys, isTestingKeys, setApiKeys, testKeyFunctionality]);
  
  // Έλεγχος λειτουργικότητας κατά την αρχική φόρτωση
  useEffect(() => {
    if (apiKeys.length > 0 && !isTestingKeys) {
      // Καθυστέρηση για να μη γίνεται ο έλεγχος αμέσως κατά τη φόρτωση
      const timer = setTimeout(() => {
        checkKeysFunctionality();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [apiKeys.length, checkKeysFunctionality, isTestingKeys]);
  
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
    updateKey,
    handleImport,
    checkKeysFunctionality,
    isTestingKeys,
    
    // Βοηθητικές συναρτήσεις
    getFilteredKeys: () => filterKeys(apiKeys),
    getKeysByService: () => groupKeysByService(apiKeys)
  };
}
