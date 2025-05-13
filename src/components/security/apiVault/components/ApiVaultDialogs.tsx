
import React from "react";
import { NewApiKeyDialog } from "../NewApiKeyDialog";
import { ImportDialog } from "../ImportDialog";
import { ExportSheet } from "../ExportSheet";
import { SecuritySettingsDialog } from "../SecuritySettingsDialog";
import { UnlockDialog } from "../UnlockDialog";
import { RecoveryDialog } from "../RecoveryDialog";
import { ApiKey } from "../types";

interface ApiVaultDialogsProps {
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
  apiKeys: ApiKey[];
  addNewKey: (key: ApiKey) => void;
  handleImport: (keys: ApiKey[]) => void;
  updateKey: (key: ApiKey) => void;
  handleUnlock: (password: string) => void;
  savedMasterPassword: string;
  isEncryptionEnabled: boolean;
  setIsEncryptionEnabled: (enabled: boolean) => void;
  isAutoLockEnabled: boolean;
  setIsAutoLockEnabled: (enabled: boolean) => void;
  autoLockTimeout: number;
  setAutoLockTimeout: (timeout: number) => void;
  setSavedMasterPassword: (password: string) => void;
  recoveredKeys: ApiKey[];
  recoveryLocations: { storageKey: string; count: number }[];
  handleRecoveredImport: (keys: ApiKey[]) => void;
}

export const ApiVaultDialogs: React.FC<ApiVaultDialogsProps> = ({
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
  apiKeys,
  addNewKey,
  handleImport,
  updateKey,
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
  handleRecoveredImport
}) => {
  return (
    <>
      <NewApiKeyDialog 
        open={showDialogApiKey}
        onOpenChange={setShowDialogApiKey}
        addKey={addNewKey}
      />

      <ImportDialog 
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImport}
      />

      <ExportSheet 
        open={showExportSheet}
        onOpenChange={setShowExportSheet}
        apiKeys={apiKeys}
      />

      <SecuritySettingsDialog 
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        isEncryptionEnabled={isEncryptionEnabled}
        setIsEncryptionEnabled={setIsEncryptionEnabled}
        savedMasterPassword={savedMasterPassword}
        setSavedMasterPassword={setSavedMasterPassword}
        isAutoLockEnabled={isAutoLockEnabled}
        setIsAutoLockEnabled={setIsAutoLockEnabled}
        autoLockTimeout={autoLockTimeout}
        setAutoLockTimeout={setAutoLockTimeout}
      />

      <UnlockDialog 
        open={isUnlocking}
        onOpenChange={setIsUnlocking}
        savedMasterPassword={savedMasterPassword}
        onUnlock={handleUnlock}
      />

      <RecoveryDialog
        open={showRecoveryDialog}
        onOpenChange={setShowRecoveryDialog}
        recoveredKeys={recoveredKeys}
        locations={recoveryLocations}
        onImport={handleRecoveredImport}
        onClose={() => setShowRecoveryDialog(false)}
      />
    </>
  );
}
