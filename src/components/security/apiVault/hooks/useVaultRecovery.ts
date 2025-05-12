
import { useEffect } from "react";
import { toast } from "sonner";
import { recoverAllApiKeys } from "../utils";
import { ApiKey } from "../types";

interface UseVaultRecoveryProps {
  apiKeys: ApiKey[];
  isRecovering: boolean;
  setIsRecovering: (value: boolean) => void;
  setRecoveredKeys: (keys: ApiKey[]) => void;
  setRecoveryLocations: (locations: { storageKey: string; count: number }[]) => void;
  setShowRecoveryDialog: (show: boolean) => void;
}

export function useVaultRecovery({
  apiKeys,
  isRecovering,
  setIsRecovering,
  setRecoveredKeys,
  setRecoveryLocations,
  setShowRecoveryDialog
}: UseVaultRecoveryProps) {
  
  // Attempt automatic recovery when the component mounts and no keys are found
  useEffect(() => {
    // If no keys in localStorage, run recovery to find them
    if (apiKeys.length === 0) {
      console.log('No keys found, attempting automatic recovery...');
      setTimeout(() => {
        handleRecoverClick();
      }, 1000);
    }
  }, []);

  // Handle recovery scan
  const handleRecoverClick = () => {
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
  };
  
  return {
    handleRecoverClick
  };
}
