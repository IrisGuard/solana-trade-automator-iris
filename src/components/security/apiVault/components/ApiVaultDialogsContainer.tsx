
import React from "react";
import { ApiKey } from "../types";
import { ApiVaultDialogs } from "./ApiVaultDialogs";

export interface ApiVaultDialogsContainerProps {
  // Dialog visibility state
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
  isLocked: boolean;
  
  // Key management
  apiKeys: ApiKey[];
  addNewKey: (key: ApiKey) => void;
  handleImport: (keys: ApiKey[]) => void;
  updateKey: (key: ApiKey) => void;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
  
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
  
  // Key testing
  testKeyFunctionality: any;
}

export const ApiVaultDialogsContainer: React.FC<ApiVaultDialogsContainerProps> = (props) => {
  return (
    <ApiVaultDialogs
      showDialogApiKey={props.showDialogApiKey}
      setShowDialogApiKey={props.setShowDialogApiKey}
      showImportDialog={props.showImportDialog}
      setShowImportDialog={props.setShowImportDialog}
      showExportSheet={props.showExportSheet}
      setShowExportSheet={props.setShowExportSheet}
      showSettingsDialog={props.showSettingsDialog}
      setShowSettingsDialog={props.setShowSettingsDialog}
      showRecoveryDialog={props.showRecoveryDialog}
      setShowRecoveryDialog={props.setShowRecoveryDialog}
      isUnlocking={props.isUnlocking}
      setIsUnlocking={props.setIsUnlocking}
      isLocked={props.isLocked}
      apiKeys={props.apiKeys}
      addNewKey={props.addNewKey}
      updateKey={props.updateKey}
      handleImport={props.handleImport}
      setApiKeys={props.setApiKeys}
      handleUnlock={props.handleUnlock}
      savedMasterPassword={props.savedMasterPassword}
      isEncryptionEnabled={props.isEncryptionEnabled}
      setIsEncryptionEnabled={props.setIsEncryptionEnabled}
      isAutoLockEnabled={props.isAutoLockEnabled}
      setIsAutoLockEnabled={props.setIsAutoLockEnabled}
      autoLockTimeout={props.autoLockTimeout}
      setAutoLockTimeout={props.setAutoLockTimeout}
      setSavedMasterPassword={props.setSavedMasterPassword}
      recoveredKeys={props.recoveredKeys}
      recoveryLocations={props.recoveryLocations}
      handleRecoveredImport={props.handleRecoveredImport}
      testKeyFunctionality={props.testKeyFunctionality}
    />
  );
};
