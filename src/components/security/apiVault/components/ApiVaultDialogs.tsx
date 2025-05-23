
import React from "react";
import { ApiKey } from "../types";
import { ImportDialog } from "../ImportDialog";
import { ExportSheet } from "../ExportSheet";
import { SecuritySettingsDialog } from "../SecuritySettingsDialog";
import { NewApiKeyDialog } from "./NewApiKeyDialog";
import { RecoveryDialog } from "../RecoveryDialog";
import { UnlockDialog } from "../UnlockDialog";

export interface ApiVaultDialogsProps {
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
  updateKey: (key: ApiKey) => void;
  handleImport: (keys: ApiKey[]) => void;
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
  
  // Testing
  testKeyFunctionality: any;
}

export const ApiVaultDialogs: React.FC<ApiVaultDialogsProps> = (props) => {
  const {
    showDialogApiKey,
    setShowDialogApiKey,
    showImportDialog,
    setShowImportDialog,
    showExportSheet,
    setShowExportSheet,
    showSettingsDialog,
    setShowSettingsDialog,
    showRecoveryDialog,
    setShowRecoveryDialog,
    isUnlocking,
    setIsUnlocking,
    isLocked,
    apiKeys,
    addNewKey,
    updateKey,
    handleImport,
    setApiKeys,
    handleUnlock,
    savedMasterPassword,
    isEncryptionEnabled,
    setIsEncryptionEnabled,
    isAutoLockEnabled,
    setIsAutoLockEnabled,
    autoLockTimeout,
    setAutoLockTimeout,
    setSavedMasterPassword,
    recoveredKeys,
    recoveryLocations,
    handleRecoveredImport,
    testKeyFunctionality,
  } = props;

  return (
    <>
      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImport}
      />

      {/* Export Sheet */}
      <ExportSheet
        open={showExportSheet}
        onOpenChange={setShowExportSheet}
        apiKeys={apiKeys}
      />

      {/* Settings Dialog */}
      <SecuritySettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        isEncryptionEnabled={isEncryptionEnabled}
        setIsEncryptionEnabled={setIsEncryptionEnabled}
        isAutoLockEnabled={isAutoLockEnabled}
        setIsAutoLockEnabled={setIsAutoLockEnabled}
        autoLockTimeout={autoLockTimeout}
        setAutoLockTimeout={setAutoLockTimeout}
        savedMasterPassword={savedMasterPassword}
        setSavedMasterPassword={setSavedMasterPassword}
      />

      {/* New/Edit API Key Dialog */}
      <NewApiKeyDialog
        open={showDialogApiKey}
        onOpenChange={setShowDialogApiKey}
        onAddKey={addNewKey}
        onUpdateKey={updateKey}
        testKeyFunctionality={testKeyFunctionality}
      />

      {/* Recovery Dialog */}
      <RecoveryDialog
        open={showRecoveryDialog}
        onOpenChange={setShowRecoveryDialog}
        recoveredKeys={recoveredKeys}
        locations={recoveryLocations}
        onImport={handleRecoveredImport}
        onClose={() => setShowRecoveryDialog(false)}
      />

      {/* Unlock Dialog */}
      <UnlockDialog
        open={isUnlocking}
        onOpenChange={setIsUnlocking}
        onUnlock={handleUnlock}
      />
    </>
  );
};
