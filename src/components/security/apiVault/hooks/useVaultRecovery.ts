
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { recoverAllApiKeys } from "../utils";
import { ApiKey } from "../types";

interface UseVaultRecoveryProps {
  apiKeys: ApiKey[];
}

export function useVaultRecovery({ apiKeys }: UseVaultRecoveryProps) {
  const [recoveredKeys, setRecoveredKeys] = useState<ApiKey[]>([]);
  const [recoveryLocations, setRecoveryLocations] = useState<{ storageKey: string; count: number }[]>([]);
  const [isRecovering, setIsRecovering] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  
  // Attempt automatic recovery when the component mounts and no keys are found
  useEffect(() => {
    // If no keys in localStorage, run recovery to find them
    if (apiKeys.length === 0) {
      console.log('No keys found, attempting automatic recovery...');
      setTimeout(() => {
        handleRecoverClick();
      }, 1000);
    }
  }, [apiKeys]);

  // Handle recovery scan
  const handleRecoverClick = useCallback(() => {
    setIsRecovering(true);
    setTimeout(() => {
      try {
        const result = recoverAllApiKeys();
        setRecoveredKeys(result.keys);
        setRecoveryLocations(result.locations);
        
        if (result.keys.length > 0) {
          setShowRecoveryDialog(true);
          toast.success(`Βρέθηκαν ${result.keys.length} κλειδιά σε ${result.locations.length} τοποθεσίες`);
        } else {
          toast.info('Δεν βρέθηκαν επιπλέον κλειδιά API');
        }
      } catch (e) {
        console.error('Recovery error:', e);
        toast.error('Σφάλμα κατά την ανάκτηση κλειδιών');
      } finally {
        setIsRecovering(false);
      }
    }, 1000);
  }, []);
  
  return {
    isRecovering,
    setIsRecovering,
    recoveredKeys,
    recoveryLocations,
    handleRecoverClick,
    showRecoveryDialog,
    setShowRecoveryDialog
  };
}
