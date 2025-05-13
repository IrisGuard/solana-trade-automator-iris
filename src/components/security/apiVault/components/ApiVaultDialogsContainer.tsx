
import React from "react";
import { ApiVaultDialogs } from "./ApiVaultDialogs";
import { ApiKey } from "../types";

interface ApiVaultDialogsContainerProps {
  // Dialog states
  showDialogApiKey: boolean;
  setShowDialogApiKey: (show: boolean) => void;
  showImportDialog: boolean;
  setShowImportDialog: (show: boolean) => void;
  showExportSheet: boolean;
  setShowExportSheet: (show: boolean) => void;
  showSettingsDialog: boolean;
  setShowSettingsDialog: (show: boolean) => void;
  showRecoveryDialog: boolean;
  setShowRecoveryDialog: (show: boolean) => void;
  isUnlocking: boolean;
  setIsUnlocking: (unlocking: boolean) => void;
  
  // Key management
  apiKeys: ApiKey[];
  addNewKey: (key: ApiKey) => void;
  handleImport: (keys: ApiKey[]) => void;
  updateKey: (key: ApiKey) => void;
  
  // Security
  handleUnlock: (password: string) => void;
  savedMasterPassword: string;
  isEncryptionEnabled: boolean;
  setIsEncryptionEnabled: (enabled: boolean) => void;
  isAutoLockEnabled: boolean;
  setIsAutoLockEnabled: (enabled: boolean) => void;
  autoLockTimeout: number;
  setAutoLockTimeout: (timeout: number) => void;
  setSavedMasterPassword: (password: string) => void;
  
  // Recovery
  recoveredKeys: ApiKey[];
  recoveryLocations: { storageKey: string; count: number }[];
  handleRecoveredImport: (keys: ApiKey[]) => void;
  recoverFromBackup?: () => Promise<ApiKey[]>;
}

export const ApiVaultDialogsContainer: React.FC<ApiVaultDialogsContainerProps> = (props) => {
  return (
    <ApiVaultDialogs {...props} />
  );
};
