
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiKeyStorageState } from "../hooks/useApiKeyStorage";

interface ApiStorageErrorProps {
  storageState: ApiKeyStorageState;
}

export const ApiStorageError: React.FC<ApiStorageErrorProps> = ({ storageState }) => {
  if (!storageState.error) {
    return null;
  }
  
  return (
    <Alert variant={storageState.hasBackupData ? "default" : "destructive"} className="mb-4">
      <AlertDescription>
        {storageState.error}
        {storageState.hasBackupData && " (Χρησιμοποιούνται εφεδρικά δεδομένα)"}
      </AlertDescription>
    </Alert>
  );
};
