
import { useState } from "react";
import { ApiKey } from "../types";
import { toast } from "sonner";

export function useApiKeyOperations(initialApiKeys: ApiKey[] = []) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);

  // Προσθήκη νέου κλειδιού
  const addNewKey = (newKey: ApiKey) => {
    // Διασφάλιση ότι το κλειδί έχει ID και ημερομηνία δημιουργίας
    const keyWithDefaults = {
      ...newKey,
      id: newKey.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: newKey.createdAt || new Date().toISOString()
    };
    
    setApiKeys(prev => [...prev, keyWithDefaults]);
    toast.success("Το κλειδί προστέθηκε επιτυχώς");
  };

  // Διαγραφή κλειδιού
  const deleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast.success("Το κλειδί διαγράφηκε επιτυχώς");
  };

  // Διαχείριση μαζικής εισαγωγής
  const handleImport = (importedKeys: ApiKey[]) => {
    // Έλεγχος για διπλότυπα συγκρίνοντας τις τιμές των κλειδιών
    const existingKeyValues = new Set(apiKeys.map(key => key.key));
    
    // Φιλτράρισμα κλειδιών που υπάρχουν ήδη
    const newKeys = importedKeys.filter(key => !existingKeyValues.has(key.key));
    
    // Προσθήκη νέων κλειδιών
    if (newKeys.length > 0) {
      setApiKeys(prev => [...prev, ...newKeys]);
      
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
    deleteKey,
    handleImport
  };
}
