
import React from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useApiVault } from "./hooks/useApiVault";
import { ApiVaultHeader } from "./ApiVaultHeader";
import { ApiVaultContent } from "./ApiVaultContent";
import { NewApiKeyDialog } from "./NewApiKeyDialog";
import { ImportDialog } from "./ImportDialog";
import { ExportSheet } from "./ExportSheet";
import { SecuritySettingsDialog } from "./SecuritySettingsDialog";
import { UnlockDialog } from "./UnlockDialog";

export const ApiVaultCard = () => {
  const {
    apiKeys,
    showDialogApiKey,
    setShowDialogApiKey,
    showImportDialog,
    setShowImportDialog,
    showExportSheet,
    setShowExportSheet,
    showSettingsDialog,
    setShowSettingsDialog,
    isUnlocking,
    setIsUnlocking,
    isKeyVisible,
    searchTerm,
    setSearchTerm,
    filterService,
    setFilterService,
    savedMasterPassword,
    setSavedMasterPassword,
    isEncryptionEnabled,
    setIsEncryptionEnabled,
    isLocked,
    isAutoLockEnabled,
    setIsAutoLockEnabled,
    autoLockTimeout,
    setAutoLockTimeout,
    addNewKey,
    deleteKey,
    toggleKeyVisibility,
    handleImport,
    getFilteredKeys,
    getKeysByService,
    handleUnlock,
    handleLock
  } = useApiVault();

  return (
    <Card>
      <CardHeader>
        <ApiVaultHeader 
          isLocked={isLocked}
          isEncryptionEnabled={isEncryptionEnabled}
          onLock={handleLock}
          onExport={() => setShowExportSheet(true)}
          onImport={() => setShowImportDialog(true)}
          onSettings={() => setShowSettingsDialog(true)}
          onAddKey={() => setShowDialogApiKey(true)}
          onUnlock={() => setIsUnlocking(true)}
        />
        <CardDescription>Διαχειριστείτε τα κλειδιά API σας με ασφάλεια</CardDescription>
      </CardHeader>
      <CardContent>
        <ApiVaultContent 
          isLocked={isLocked}
          apiKeys={apiKeys}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterService={filterService}
          setFilterService={setFilterService}
          isKeyVisible={isKeyVisible}
          toggleKeyVisibility={toggleKeyVisibility}
          deleteKey={deleteKey}
          getFilteredKeys={getFilteredKeys}
          getKeysByService={getKeysByService}
          onAddKeyClick={() => setShowDialogApiKey(true)}
          onUnlockClick={() => setIsUnlocking(true)}
        />

        {/* Dialogs and Sheets */}
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
      </CardContent>
    </Card>
  );
};
