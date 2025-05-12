
import { useCallback } from "react";
import { toast } from "sonner";
import { ApiKey } from "../types";

interface UseKeyOperationsProps {
  apiKeys: ApiKey[];
  handleImport: (keys: ApiKey[]) => void;
  recoveredKeys: ApiKey[];
  setShowRecoveryDialog: (show: boolean) => void;
}

export function useKeyOperations({
  apiKeys,
  handleImport,
  recoveredKeys,
  setShowRecoveryDialog
}: UseKeyOperationsProps) {
  
  // Handle the import of recovered keys
  const handleRecoveredImport = useCallback((keys: ApiKey[]) => {
    handleImport(keys);
    setShowRecoveryDialog(false);
    toast.success(`Εισήχθησαν ${keys.length} κλειδιά επιτυχώς`);
  }, [handleImport, setShowRecoveryDialog]);
  
  // Calculate statistics for keys
  const keyStats = {
    total: apiKeys.length,
    active: apiKeys.filter(key => key.status === "active" || !key.status).length,
    expired: apiKeys.filter(key => key.status === "expired").length,
    revoked: apiKeys.filter(key => key.status === "revoked").length,
  };
  
  return {
    handleRecoveredImport,
    keyStats,
  };
}
