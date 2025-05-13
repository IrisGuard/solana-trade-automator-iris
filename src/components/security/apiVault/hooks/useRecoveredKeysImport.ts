
import { useCallback } from "react";
import { toast } from "sonner";
import { ApiKey } from "../types";

interface UseRecoveredKeysImportProps {
  apiKeys: ApiKey[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
  setShowRecoveryDialog: (show: boolean) => void;
}

export function useRecoveredKeysImport({
  apiKeys,
  setApiKeys,
  setShowRecoveryDialog
}: UseRecoveredKeysImportProps) {
  const handleRecoveredImport = useCallback((keys: ApiKey[]) => {
    if (keys.length === 0) {
      toast.error("Δεν υπάρχουν κλειδιά για εισαγωγή");
      return;
    }
    
    try {
      // Filter out duplicates
      const newKeys = keys.filter(recoveredKey => 
        !apiKeys.some(existingKey => existingKey.key === recoveredKey.key)
      );
      
      if (newKeys.length === 0) {
        toast.info("Όλα τα ανακτηθέντα κλειδιά υπάρχουν ήδη");
        return;
      }
      
      // Add the new keys
      setApiKeys(prev => [...prev, ...newKeys]);
      toast.success(`Εισαγωγή ${newKeys.length} ανακτηθέντων κλειδιών`);
      setShowRecoveryDialog(false);
    } catch (e) {
      console.error("Σφάλμα κατά την εισαγωγή ανακτηθέντων κλειδιών:", e);
      toast.error("Σφάλμα κατά την εισαγωγή κλειδιών");
    }
  }, [apiKeys, setApiKeys, setShowRecoveryDialog]);

  return {
    handleRecoveredImport
  };
}
