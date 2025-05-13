
import React from "react";
import { useApiKeyManagement } from "./hooks/useApiKeyManagement";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiVaultHeader } from "./components/ApiVaultHeader";
import { ApiVaultContent } from "./components/ApiVaultContent";
import { ApiVaultDialogsContainer } from "./components/ApiVaultDialogsContainer";
import { LockedVaultState } from "./LockedVaultState";
import { useApiKeyStorage } from "./hooks/useApiKeyStorage";
import { HeliusIntegrationButton } from "./HeliusIntegrationButton";
import { useKeyTestingState } from "./hooks/useKeyTestingState";

export function ApiVaultCard() {
  const [isLocked, setIsLocked] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("all");
  const [isUnlocking, setIsUnlocking] = React.useState(false);
  const [showDialogApiKey, setShowDialogApiKey] = React.useState(false);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportSheet, setShowExportSheet] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = React.useState(false);
  const [isRecovering, setIsRecovering] = React.useState(false);
  
  const {
    apiKeys,
    setApiKeys,
    isKeyVisible,
    toggleKeyVisibility,
    searchTerm,
    setSearchTerm,
    filterService,
    setFilterService,
    addNewKey,
    deleteKey,
    updateKey,
    handleImport,
    getFilteredKeys,
    getKeysByService
  } = useApiKeyManagement();

  const {
    testKeyFunctionality,
    recoverFromBackup,
    storageState
  } = useApiKeyStorage(apiKeys, setApiKeys);
  
  // Use the key testing state hook
  const { isTestingKeys, handleRefreshKeys } = useKeyTestingState();

  const handleLock = () => {
    setIsLocked(true);
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  // Calculate key statistics
  const keyStats = {
    total: apiKeys.length,
    active: apiKeys.filter(key => key.status === "active" || !key.status).length,
    expired: apiKeys.filter(key => key.status === "expired").length,
    revoked: apiKeys.filter(key => key.status === "revoked").length
  };

  // Generate service statistics
  const serviceStats = Object.entries(getKeysByService()).map(([name, keys]) => ({
    name,
    count: keys.length
  }));

  const handleRecoverClick = () => {
    setIsRecovering(true);
    setTimeout(() => setIsRecovering(false), 3000);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <ApiVaultHeader
              apiKeysCount={apiKeys.length}
              isLocked={isLocked}
              onAddKey={() => setShowDialogApiKey(true)}
              onImport={() => setShowImportDialog(true)}
              onExport={() => setShowExportSheet(true)}
              onSettings={() => setShowSettingsDialog(true)}
              isEncryptionEnabled={false}
              onUnlock={() => setIsUnlocking(true)}
              onLock={handleLock}
            />
            <HeliusIntegrationButton />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {isLocked ? (
            <LockedVaultState onUnlockClick={() => setIsUnlocking(true)} />
          ) : (
            <ApiVaultContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              apiKeys={apiKeys}
              setApiKeys={setApiKeys}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterService={filterService}
              setFilterService={setFilterService}
              isKeyVisible={isKeyVisible}
              toggleKeyVisibility={toggleKeyVisibility}
              deleteKey={deleteKey}
              getFilteredKeys={getFilteredKeys}
              getKeysByService={getKeysByService}
              keyStats={keyStats}
              serviceStats={serviceStats}
              isLocked={isLocked}
              isRecovering={isRecovering}
              isTestingKeys={isTestingKeys}
              handleRefreshKeys={() => handleRefreshKeys(apiKeys, setApiKeys, testKeyFunctionality)}
              handleRecoverClick={handleRecoverClick}
              setShowImportDialog={setShowImportDialog}
              setShowExportSheet={setShowExportSheet}
              setShowSettingsDialog={setShowSettingsDialog}
              setIsUnlocking={setIsUnlocking}
              setShowDialogApiKey={setShowDialogApiKey}
              handleLock={handleLock}
              storageState={storageState}
            />
          )}
        </CardContent>
      </Card>

      <ApiVaultDialogsContainer
        apiKeys={apiKeys}
        showDialogApiKey={showDialogApiKey}
        setShowDialogApiKey={setShowDialogApiKey}
        showImportDialog={showImportDialog}
        setShowImportDialog={setShowImportDialog}
        showExportSheet={showExportSheet}
        setShowExportSheet={setShowExportSheet}
        showSettingsDialog={showSettingsDialog}
        setShowSettingsDialog={setShowSettingsDialog}
        showRecoveryDialog={showRecoveryDialog}
        setShowRecoveryDialog={setShowRecoveryDialog}
        isUnlocking={isUnlocking}
        setIsUnlocking={setIsUnlocking}
        handleUnlock={handleUnlock}
        addNewKey={addNewKey}
        handleImport={handleImport}
        updateKey={updateKey}
        savedMasterPassword=""
        isEncryptionEnabled={false}
        setIsEncryptionEnabled={() => {}}
        isAutoLockEnabled={false}
        setIsAutoLockEnabled={() => {}}
        autoLockTimeout={0}
        setAutoLockTimeout={() => {}}
        setSavedMasterPassword={() => {}}
        recoveredKeys={[]}
        recoveryLocations={[]}
        handleRecoveredImport={() => {}}
      />
    </>
  );
}
