
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
  const [useDemoKeysAsFallback, setUseDemoKeysAsFallback] = useState(true); // Άλλαξα σε true για να φορτώνονται πάντα τα demo keys
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
  
  // Εάν δεν υπάρχουν κλειδιά και έχει ενεργοποιηθεί το fallback, φορτώνουμε τα demo keys
  useEffect(() => {
    if (useDemoKeysAsFallback && apiKeys.length === 0) {
      console.log('Φόρτωση demo κλειδιών ως fallback');
      setApiKeys(demoKeys);
    }
  }, [useDemoKeysAsFallback, apiKeys.length, setApiKeys]);

  // Προσθέτουμε αυτόματη προσθήκη των 26 κλειδιών επίδειξης κατά την αρχική φόρτωση
  useEffect(() => {
    // Εκτελείται μόνο μία φορά κατά την αρχική φόρτωση
    const demoKeysInjected = localStorage.getItem('demoKeysInjected');
    
    if (!demoKeysInjected) {
      console.log('Προσθήκη 26 κλειδιών επίδειξης κατά την πρώτη φόρτωση');
      
      // Προσθέτουμε 26 παραδείγματα κλειδιών
      const services = [
        'binance', 'solana', 'ethereum', 'kraken', 'coinbase', 'metamask', 
        'phantom', 'wallet', 'rpc', 'explorer', 'api', 'exchange'
      ];
      
      const newKeys: ApiKey[] = [];
      
      // Δημιουργούμε ακριβώς 26 κλειδιά
      for (let i = 0; i < 26; i++) {
        const service = services[i % services.length];
        const key = `demo${i+1}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        
        newKeys.push({
          id: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${i}`,
          name: `${service.charAt(0).toUpperCase() + service.slice(1)} Demo Key ${i+1}`,
          key: key,
          service: service,
          createdAt: new Date().toISOString(),
          description: `Demo key for testing - ${service}`,
          isWorking: Math.random() > 0.2, // 80% chance of working
          status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'expired' : 'revoked') : 'active',
          source: 'demo'
        });
      }
      
      localStorage.setItem('apiKeys', JSON.stringify(newKeys));
      localStorage.setItem('demoKeysInjected', 'true');
      setApiKeys(newKeys);
    }
  }, [setApiKeys]);
  
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
