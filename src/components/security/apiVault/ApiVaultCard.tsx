
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useApiVault } from "./hooks/useApiVault";
import { ApiVaultHeader } from "./ApiVaultHeader";
import { ApiVaultDescription } from "./components/ApiVaultDescription";
import { ApiVaultTabs } from "./components/ApiVaultTabs";
import { ApiVaultDialogs } from "./components/ApiVaultDialogs";
import { toast } from "sonner";

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
    showRecoveryDialog,
    setShowRecoveryDialog,
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
    handleLock,
    checkKeysFunctionality,
    isTestingKeys,
    recoverKeys,
    isRecovering,
    recoveredKeys,
    recoveryLocations,
    handleRecoveredImport
  } = useApiVault();
  
  const [activeTab, setActiveTab] = useState<string>("keys");

  // Calculate key statistics
  const keyStats = {
    total: apiKeys.length,
    active: apiKeys.filter(key => !key.status || key.status === "active").length,
    expired: apiKeys.filter(key => key.status === "expired").length,
    revoked: apiKeys.filter(key => key.status === "revoked").length,
    working: apiKeys.filter(key => key.isWorking === true).length,
    notWorking: apiKeys.filter(key => key.isWorking === false).length
  };
  
  // Calculate services statistics
  const services = apiKeys.reduce((acc, key) => {
    if (!acc[key.service]) {
      acc[key.service] = {
        name: key.service,
        count: 0,
        workingCount: 0
      };
    }
    acc[key.service].count += 1;
    if (key.isWorking === true) {
      acc[key.service].workingCount += 1;
    }
    return acc;
  }, {} as Record<string, {name: string, count: number, workingCount: number}>);

  const handleRefreshKeys = () => {
    if (isTestingKeys) {
      toast.info("Έλεγχος κλειδιών σε εξέλιξη, παρακαλώ περιμένετε...");
      return;
    }
    checkKeysFunctionality();
  };

  const handleRecoverClick = () => {
    if (isRecovering) {
      toast.info("Ανάκτηση κλειδιών σε εξέλιξη, παρακαλώ περιμένετε...");
      return;
    }
    recoverKeys();
  };

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
        <ApiVaultDescription 
          isLocked={isLocked}
          apiKeys={apiKeys}
          isRecovering={isRecovering}
          isTestingKeys={isTestingKeys}
          handleRecoverClick={handleRecoverClick}
        />
      </CardHeader>
      <CardContent>
        <ApiVaultTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          apiKeys={apiKeys}
          isLocked={isLocked}
          keyStats={keyStats}
          services={Object.values(services)}
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
        />

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
      </CardContent>
    </Card>
  );
};
