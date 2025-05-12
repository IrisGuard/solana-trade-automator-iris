
import { useState } from "react";
import { ApiKey } from "../types";
import { toast } from "sonner";
import { saveKeysToStorage } from "../utils/storageUtils";

export function useApiKeyOperations(initialApiKeys: ApiKey[] = []) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  
  // Σημαία ασφαλείας που διασφαλίζει ότι μόνο διαγραφές που έχει ξεκινήσει ο χρήστης επιτρέπονται
  const [userInitiatedDelete, setUserInitiatedDelete] = useState(false);

  // Νέος κωδικός ασφαλείας για προστασία από μη εξουσιοδοτημένες διαγραφές
  const [securityToken, setSecurityToken] = useState<string>(
    `sec-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  );

  // Προσθήκη νέου κλειδιού
  const addNewKey = (newKey: ApiKey) => {
    // Διασφάλιση ότι το κλειδί έχει ID και ημερομηνία δημιουργίας
    const keyWithDefaults = {
      ...newKey,
      id: newKey.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: newKey.createdAt || new Date().toISOString(),
      status: newKey.status || 'active'
    };
    
    const updatedKeys = [...apiKeys, keyWithDefaults];
    setApiKeys(updatedKeys);
    
    // Save to localStorage with redundancy
    saveKeysToStorage(updatedKeys, false, "");
    
    toast.success("Το κλειδί προστέθηκε επιτυχώς");
  };

  // Διαγραφή κλειδιού - Protected with user confirmation and security token
  const deleteKey = (id: string) => {
    // Επαλήθευση ότι η διαγραφή έχει εκκινηθεί από τον χρήστη
    if (!userInitiatedDelete) {
      console.error("Η διαγραφή κλειδιού απορρίφθηκε - απαιτείται επιβεβαίωση χρήστη");
      toast.error("Η διαγραφή κλειδιού απέτυχε - απαιτείται αλληλεπίδραση χρήστη");
      return;
    }
    
    // Επιπλέον έλεγχος ασφαλείας για προστασία από προγραμματικές διαγραφές
    const currentTime = Date.now();
    const tokenParts = securityToken.split('-');
    if (tokenParts.length < 2 || currentTime - parseInt(tokenParts[1]) > 300000) {
      console.error("Η διαγραφή κλειδιού απορρίφθηκε - άκυρο token ασφαλείας");
      toast.error("Η διαγραφή κλειδιού απέτυχε - επικοινωνήστε με την υποστήριξη");
      return;
    }
    
    // Επαναφορά σημαίας μετά από κάθε χρήση
    setUserInitiatedDelete(false);
    
    // Δημιουργία αντιγράφου ασφαλείας πριν τη διαγραφή
    const backupKeys = [...apiKeys];
    localStorage.setItem(`apiKeys_before_delete_${Date.now()}`, JSON.stringify(backupKeys));
    
    // Εκτέλεση της διαγραφής
    const updatedKeys = apiKeys.filter(key => key.id !== id);
    setApiKeys(updatedKeys);
    
    // Αποθήκευση στο localStorage με αντίγραφο ασφαλείας
    saveKeysToStorage(updatedKeys, false, "");
    
    // Ανανέωση του token ασφαλείας
    setSecurityToken(`sec-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`);
    
    toast.success("Το κλειδί διαγράφηκε επιτυχώς");
  };

  // Μέθοδος για ενεργοποίηση της σημαίας διαγραφής από τον χρήστη - ΜΟΝΟ από UI components
  const confirmKeyDeletion = (id: string) => {
    setUserInitiatedDelete(true);
    // Μετά την ενεργοποίηση της σημαίας, άμεση διαγραφή του κλειδιού
    setTimeout(() => deleteKey(id), 0);
  };

  // Ενημέρωση κλειδιού
  const updateKey = (updatedKey: ApiKey) => {
    const updatedKeys = apiKeys.map(key => 
      key.id === updatedKey.id ? { ...key, ...updatedKey } : key
    );
    
    setApiKeys(updatedKeys);
    
    // Αποθήκευση στο localStorage με αντίγραφο ασφαλείας
    saveKeysToStorage(updatedKeys, false, "");
    
    toast.success("Το κλειδί ενημερώθηκε επιτυχώς");
  };

  // Διαχείριση μαζικής εισαγωγής
  const handleImport = (importedKeys: ApiKey[]) => {
    // Make backup before import
    localStorage.setItem(`apiKeys_before_import_${Date.now()}`, JSON.stringify(apiKeys));
    
    // Έλεγχος για διπλότυπα συγκρίνοντας τις τιμές των κλειδιών
    const existingKeyValues = new Set(apiKeys.map(key => key.key));
    
    // Φιλτράρισμα κλειδιών που υπάρχουν ήδη
    const newKeys = importedKeys.filter(key => !existingKeyValues.has(key.key))
      .map(key => ({
        ...key,
        id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: key.createdAt || new Date().toISOString(),
        status: key.status || 'active'
      }));
    
    // Προσθήκη νέων κλειδιών
    if (newKeys.length > 0) {
      const updatedKeys = [...apiKeys, ...newKeys];
      setApiKeys(updatedKeys);
      
      // Αποθήκευση στο localStorage με αντίγραφο ασφαλείας
      saveKeysToStorage(updatedKeys, false, "");
      
      if (newKeys.length !== importedKeys.length) {
        toast.warning(`Προστέθηκαν ${newKeys.length} νέα κλειδιά. ${importedKeys.length - newKeys.length} παραλείφθηκαν ως διπλότυπα.`);
      } else {
        toast.success(`Προστέθηκαν ${newKeys.length} νέα κλειδιά επιτυχώς!`);
      }
    } else if (importedKeys.length > 0) {
      toast.warning("Όλα τα κλειδιά υπάρχουν ήδη στην κλειδοθήκη σας");
    }
  };

  return {
    apiKeys,
    setApiKeys,
    addNewKey,
    // Η δημόσια μέθοδος είναι πλέον confirmKeyDeletion αντί για deleteKey
    deleteKey: confirmKeyDeletion,
    updateKey,
    handleImport
  };
}
