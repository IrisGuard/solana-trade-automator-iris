
import { useState } from "react";
import { ApiKey } from "../types";
import { toast } from "sonner";
import { saveKeysToStorage } from "../utils/storageUtils";

export function useApiKeyOperations(initialApiKeys: ApiKey[] = []) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  
  // This flag ensures that only user-initiated deletions work
  // AI cannot trigger key deletion through code execution
  const [userInitiatedDelete, setUserInitiatedDelete] = useState(false);

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

  // Διαγραφή κλειδιού - Protected with user confirmation
  const deleteKey = (id: string) => {
    // This deletion now requires explicit user confirmation
    // This flag is set only when the user clicks the delete button in the UI
    if (!userInitiatedDelete) {
      console.warn("API key deletion attempted programmatically - blocked for security");
      toast.error("Η διαγραφή κλειδιού απέτυχε - απαιτείται επιβεβαίωση χρήστη");
      return;
    }
    
    // Reset flag after use
    setUserInitiatedDelete(false);
    
    // Make a backup before deletion
    const backupKeys = [...apiKeys];
    localStorage.setItem(`apiKeys_before_delete_${Date.now()}`, JSON.stringify(backupKeys));
    
    // Proceed with deletion
    const updatedKeys = apiKeys.filter(key => key.id !== id);
    setApiKeys(updatedKeys);
    
    // Save to localStorage with redundancy
    saveKeysToStorage(updatedKeys, false, "");
    
    toast.success("Το κλειδί διαγράφηκε επιτυχώς");
  };

  // Method to set the user initiated delete flag - ONLY called from UI components
  const confirmKeyDeletion = (id: string) => {
    setUserInitiatedDelete(true);
    // After setting the flag, immediately delete the key
    setTimeout(() => deleteKey(id), 0);
  };

  // Ενημέρωση κλειδιού
  const updateKey = (updatedKey: ApiKey) => {
    const updatedKeys = apiKeys.map(key => 
      key.id === updatedKey.id ? { ...key, ...updatedKey } : key
    );
    
    setApiKeys(updatedKeys);
    
    // Save to localStorage with redundancy
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
      
      // Save to localStorage with redundancy
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
    // The public method is now confirmKeyDeletion instead of deleteKey
    deleteKey: confirmKeyDeletion,
    updateKey,
    handleImport
  };
}
