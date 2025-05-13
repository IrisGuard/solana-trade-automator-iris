
import React from "react";
import { useApiKeyManagement } from "./hooks/useApiKeyManagement";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiVaultHeader } from "./components/ApiVaultHeader";
import { ApiVaultContent } from "./components/ApiVaultContent";
import { ApiVaultDialogsContainer } from "./components/ApiVaultDialogsContainer";
import { LockedVaultState } from "./LockedVaultState";
import { useApiKeyStorage } from "./hooks/useApiKeyStorage";
import { HeliusIntegrationButton } from "./HeliusIntegrationButton"; // Προσθήκη εισαγωγής

export function ApiVaultCard() {
  const [isLocked, setIsLocked] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("all");
  const [isUnlocking, setIsUnlocking] = React.useState(false);
  const [showDialogApiKey, setShowDialogApiKey] = React.useState(false);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportSheet, setShowExportSheet] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
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
    isTestingKeys,
    testAllKeys,
    keyStats,
    serviceStats,
    storageState
  } = useApiKeyStorage(apiKeys, setApiKeys, isLocked);

  const handleLock = () => {
    setIsLocked(true);
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleRefreshKeys = async () => {
    await testAllKeys();
  };

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
              apiKeyCount={apiKeys.length}
              isLocked={isLocked}
              onAddClick={() => setShowDialogApiKey(true)}
            />
            <HeliusIntegrationButton /> {/* Προσθήκη του κουμπιού Helius */}
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
              handleRefreshKeys={handleRefreshKeys}
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
        showAddKeyDialog={showDialogApiKey}
        setShowAddKeyDialog={setShowDialogApiKey}
        showImportDialog={showImportDialog}
        setShowImportDialog={setShowImportDialog}
        showExportSheet={showExportSheet}
        setShowExportSheet={setShowExportSheet}
        showSettingsDialog={showSettingsDialog}
        setShowSettingsDialog={setShowSettingsDialog}
        isUnlocking={isUnlocking}
        setIsUnlocking={setIsUnlocking}
        isLocked={isLocked}
        handleUnlock={handleUnlock}
        addNewKey={addNewKey}
        handleImport={handleImport}
        updateKey={updateKey}
      />
    </>
  );
}
