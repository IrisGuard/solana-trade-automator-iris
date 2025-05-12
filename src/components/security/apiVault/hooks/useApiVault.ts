
import { useState, useEffect, useCallback } from 'react';
import { ApiKey } from '../types';
import { recoverAllApiKeys, forceScanForKeys } from '../utils';
import { toast } from 'sonner';

export const useApiVault = () => {
  const [recoveredKeys, setRecoveredKeys] = useState<ApiKey[]>([]);
  const [recoveryLocations, setRecoveryLocations] = useState<{ storageKey: string, count: number }[]>([]);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const handleRecoverKeys = useCallback(async () => {
    try {
      setIsRecovering(true);
      setRecoverySuccess(false);
      setRecoveryError(null);
      
      const result = await recoverAllApiKeys();
      
      setRecoveredKeys(result.recoveredKeys);
      setRecoveryLocations(result.locations);
      
      if (result.recoveredKeys.length > 0) {
        setRecoverySuccess(true);
        toast.success(`Ανακτήθηκαν ${result.recoveredKeys.length} κλειδιά από ${result.locations.length} τοποθεσίες`);
      } else {
        toast.info("Δεν βρέθηκαν κλειδιά API για ανάκτηση");
      }
      
      return result;
    } catch (error) {
      console.error("Error during key recovery:", error);
      setRecoveryError(error instanceof Error ? error.message : "Unknown error during recovery");
      toast.error("Σφάλμα κατά την ανάκτηση κλειδιών");
      return {
        recoveredKeys: [],
        locations: []
      };
    } finally {
      setIsRecovering(false);
    }
  }, []);

  const handleForceScan = useCallback(async () => {
    try {
      setIsRecovering(true);
      setRecoverySuccess(false);
      setRecoveryError(null);
      
      const numKeysRecovered = await forceScanForKeys();
      
      if (numKeysRecovered > 0) {
        setRecoverySuccess(true);
        toast.success(`Προστέθηκαν ${numKeysRecovered} κλειδιά στη βάση δεδομένων`);
        return numKeysRecovered;
      } else {
        toast.info("Δεν βρέθηκαν νέα κλειδιά κατά τη σάρωση");
        return 0;
      }
    } catch (error) {
      console.error("Error during force scan:", error);
      setRecoveryError(error instanceof Error ? error.message : "Unknown error during force scan");
      toast.error("Σφάλμα κατά τη σάρωση κλειδιών");
      return 0;
    } finally {
      setIsRecovering(false);
    }
  }, []);

  // Initial recovery on component mount
  useEffect(() => {
    // We don't auto-recover on mount to avoid unexpected behavior
    // User must explicitly click the recover button
  }, []);

  return {
    recoveredKeys,
    recoveryLocations,
    isRecovering,
    recoverySuccess,
    recoveryError,
    handleRecoverKeys,
    handleForceScan
  };
};
