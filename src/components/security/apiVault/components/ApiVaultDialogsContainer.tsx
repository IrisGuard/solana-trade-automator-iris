
import React from "react";
import { ApiKey } from "../types";
import { UnlockDialog } from "./UnlockDialog";
import { ImportDialog } from "../ImportDialog";
import { ExportSheet } from "../ExportSheet";
import { RecoveryDialog } from "../RecoveryDialog";
import { SettingsDialog } from "./SettingsDialog";
import { NewApiKeyDialog } from "./NewApiKeyDialog";

interface ApiVaultDialogsContainerProps {
  isLocked: boolean;
  isUnlocking: boolean;
  setIsUnlocking: (isUnlocking: boolean) => void;
  showImportDialog: boolean;
  setShowImportDialog: (show: boolean) => void;
  showExportSheet: boolean;
  setShowExportSheet: (show: boolean) => void;
  showSettingsDialog: boolean;
  setShowSettingsDialog: (show: boolean) => void;
  showDialogApiKey: boolean;
  setShowDialogApiKey: (show: boolean) => void;
  showRecoveryDialog: boolean;
  setShowRecoveryDialog: (show: boolean) => void;
  addNewKey: (key: ApiKey) => void;
  updateKey: (key: ApiKey) => void;
  apiKeys: ApiKey[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
  testKeyFunctionality?: (key: ApiKey) => Promise<boolean>;
  handleImport: (keys: ApiKey[]) => void;
  recoveredKeys: ApiKey[];
  recoveryLocations: {storageKey: string; count: number}[];
  handleRecoveredImport: (keys: ApiKey[]) => void;
  savedMasterPassword: string;
  setSavedMasterPassword: (pass: string) => void;
  isEncryptionEnabled: boolean;
  setIsEncryptionEnabled: (enabled: boolean) => void;
  isAutoLockEnabled: boolean;
  setIsAutoLockEnabled: (enabled: boolean) => void;
  autoLockTimeout: number;
  setAutoLockTimeout: (timeout: number) => void;
  handleUnlock: (password: string) => void;
}

export const ApiVaultDialogsContainer: React.FC<ApiVaultDialogsContainerProps> = ({
  isLocked,
  isUnlocking,
  setIsUnlocking,
  showImportDialog,
  setShowImportDialog,
  showExportSheet,
  setShowExportSheet,
  showSettingsDialog,
  setShowSettingsDialog,
  showDialogApiKey,
  setShowDialogApiKey,
  showRecoveryDialog,
  setShowRecoveryDialog,
  addNewKey,
  updateKey,
  apiKeys,
  setApiKeys,
  testKeyFunctionality,
  handleImport,
  recoveredKeys,
  recoveryLocations,
  handleRecoveredImport,
  savedMasterPassword,
  setSavedMasterPassword,
  isEncryptionEnabled,
  setIsEncryptionEnabled,
  isAutoLockEnabled,
  setIsAutoLockEnabled,
  autoLockTimeout,
  setAutoLockTimeout,
  handleUnlock
}) => {
  return (
    <>
      {/* Unlock Dialog */}
      <UnlockDialog 
        open={isUnlocking} 
        onOpenChange={setIsUnlocking} 
        onUnlock={handleUnlock}
      />
      
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
      
      {/* Recovery Dialog */}
      <RecoveryDialog
        open={showRecoveryDialog}
        onOpenChange={setShowRecoveryDialog}
        recoveredKeys={recoveredKeys}
        locations={recoveryLocations}
        onImport={handleRecoveredImport}
        onClose={() => setShowRecoveryDialog(false)}
      />
      
      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        masterPassword={savedMasterPassword}
        setMasterPassword={setSavedMasterPassword}
        isEncryptionEnabled={isEncryptionEnabled}
        setIsEncryptionEnabled={setIsEncryptionEnabled}
        isAutoLockEnabled={isAutoLockEnabled}
        setIsAutoLockEnabled={setIsAutoLockEnabled}
        autoLockTimeout={autoLockTimeout}
        setAutoLockTimeout={setAutoLockTimeout}
      />
      
      {/* New/Edit API Key Dialog */}
      <NewApiKeyDialog
        open={showDialogApiKey}
        onOpenChange={setShowDialogApiKey}
        onAddKey={addNewKey}
        onUpdateKey={updateKey}
        testKeyFunctionality={testKeyFunctionality}
      />
    </>
  );
};
