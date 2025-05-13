
import { ApiKey } from "@/components/security/apiVault/types";
import { toast } from "sonner";

interface UseRecoveredKeysImportProps {
  apiKeys: ApiKey[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
  setShowRecoveryDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useRecoveredKeysImport({
  apiKeys,
  setApiKeys,
  setShowRecoveryDialog
}: UseRecoveredKeysImportProps) {
  const handleRecoveredImport = (recoveredKeys: ApiKey[]) => {
    if (!recoveredKeys || recoveredKeys.length === 0) {
      toast.error('Δεν βρέθηκαν κλειδιά για εισαγωγή');
      return;
    }

    // Συγχώνευση των υπαρχόντων και ανακτημένων κλειδιών
    const existingKeyIds = apiKeys.map(key => key.id);
    const newKeys = recoveredKeys.filter(key => !existingKeyIds.includes(key.id));
    
    if (newKeys.length === 0) {
      toast.info('Όλα τα ανακτημένα κλειδιά υπάρχουν ήδη');
      setShowRecoveryDialog(false);
      return;
    }
    
    // Προσθήκη των νέων κλειδιών
    setApiKeys(prevKeys => [...prevKeys, ...newKeys]);
    toast.success(`Εισήχθησαν ${newKeys.length} ανακτημένα κλειδιά`);
    setShowRecoveryDialog(false);
  };

  return { handleRecoveredImport };
}
