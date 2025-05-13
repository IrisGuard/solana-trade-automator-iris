
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiVaultHeader } from "./components/ApiVaultHeader";
import { ApiVaultDialogs } from "./components/ApiVaultDialogs";
import { ApiVaultTabs } from "./components/ApiVaultTabs";
import { ApiVaultActions } from "./components/ApiVaultActions";
import { useApiKeyManagement } from "./hooks/useApiKeyManagement";
import { useApiKeyVisibility } from "./hooks/useApiKeyVisibility";
import { useVaultSecurity } from "./hooks/useVaultSecurity";
import { useVaultState } from "./hooks/useVaultState";
import { useVaultRecovery } from "./hooks/useVaultRecovery";
import { useKeyOperations } from "./hooks/useKeyOperations";
import { useKeyTesting } from "./hooks/useKeyTesting";

export const ApiVaultCard = () => {
  // Get UI state from hooks
  const {
    dialogState,
    tabState,
    recoveryState,
  } = useVaultState();

  // Destructure states from hooks
  const {
    showDialogApiKey, setShowDialogApiKey,
    showImportDialog, setShowImportDialog,
    showExportSheet, setShowExportSheet,
    showSettingsDialog, setShowSettingsDialog,
    showRecoveryDialog, setShowRecoveryDialog,
  } = dialogState;

  const { activeTab, setActiveTab } = tabState;
  
  const {
    isRecovering, setIsRecovering,
    recoveredKeys, setRecoveredKeys,
    recoveryLocations, setRecoveryLocations,
    isTestingKeys, setIsTestingKeys,
  } = recoveryState;

  // Key management hooks
  const {
    apiKeys,
    setApiKeys,
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

  // Key testing hooks
  const { testSingleKey, testAllKeys } = useKeyTesting();

  // Handle refreshing all keys - Wrapper function to avoid type errors
  const handleRefreshKeys = () => {
    setIsTestingKeys(true);
    testAllKeys(apiKeys, setApiKeys)
      .finally(() => {
        setIsTestingKeys(false);
      });
  };

  // API Key Visibility hook
  const { isKeyVisible, toggleKeyVisibility } = useApiKeyVisibility();

  // Security hooks
  const {
    isEncryptionEnabled,
    setIsEncryptionEnabled,
    savedMasterPassword,
    setSavedMasterPassword,
    isLocked,
    setIsLocked,
    isAutoLockEnabled,
    setIsAutoLockEnabled,
    autoLockTimeout,
    setAutoLockTimeout,
    isUnlocking,
    setIsUnlocking,
    handleUnlock,
    handleLock,
    saveSecuritySettings
  } = useVaultSecurity({ apiKeys, setApiKeys });

  // Recovery hooks
  const { handleRecoverClick } = useVaultRecovery({
    apiKeys,
    isRecovering,
    setIsRecovering,
    setRecoveredKeys,
    setRecoveryLocations,
    setShowRecoveryDialog
  });

  // Key operations hooks
  const { handleRecoveredImport, keyStats } = useKeyOperations({
    apiKeys,
    handleImport,
    recoveredKeys,
    setShowRecoveryDialog
  });

  // Get unique services and their counts
  const serviceStats = Object.entries(getKeysByService()).map(([name, keys]) => ({
    name,
    count: keys.length,
  }));

  return (
    <Card>
      <CardHeader className="px-6 pt-6 pb-4">
        <ApiVaultHeader 
          onAddKey={() => setShowDialogApiKey(true)}
          onImport={() => setShowImportDialog(true)}
          onExport={() => setShowExportSheet(true)}
          apiKeysCount={apiKeys.length}
          onSettings={() => setShowSettingsDialog(true)}
          isLocked={isLocked}
          isEncryptionEnabled={isEncryptionEnabled}
          onUnlock={() => setIsUnlocking(true)}
          onLock={handleLock}
        />
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-6">
          {/* Key management tabs */}
          <ApiVaultTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            apiKeys={apiKeys}
            isLocked={isLocked}
            keyStats={keyStats}
            services={serviceStats}
            isTestingKeys={isTestingKeys}
            handleRefreshKeys={handleRefreshKeys}
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
            handleRecoverClick={handleRecoverClick}
            setApiKeys={setApiKeys}
          />
          
          {/* Additional actions */}
          <ApiVaultActions 
            onImportClick={() => setShowImportDialog(true)}
            onExportClick={() => setShowExportSheet(true)}
            onLockClick={isLocked ? () => setIsUnlocking(true) : handleLock}
            onSecurityClick={() => setShowSettingsDialog(true)}
            isLocked={isLocked}
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
            isRecovering={isRecovering}
            isTestingKeys={isTestingKeys}
            handleRecoverClick={handleRecoverClick}
          />
          
          {/* All dialogs */}
          <ApiVaultDialogs 
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
            apiKeys={apiKeys}
            addNewKey={addNewKey}
            handleImport={handleImport}
            handleUnlock={handleUnlock}
            savedMasterPassword={savedMasterPassword}
            isEncryptionEnabled={isEncryptionEnabled}
            setIsEncryptionEnabled={setIsEncryptionEnabled}
            isAutoLockEnabled={isAutoLockEnabled}
            setIsAutoLockEnabled={setIsAutoLockEnabled}
            autoLockTimeout={autoLockTimeout}
            setAutoLockTimeout={setAutoLockTimeout}
            setSavedMasterPassword={setSavedMasterPassword}
            recoveredKeys={recoveredKeys}
            recoveryLocations={recoveryLocations}
            handleRecoveredImport={handleRecoveredImport}
          />
        </div>
      </CardContent>
    </Card>
  );
};
