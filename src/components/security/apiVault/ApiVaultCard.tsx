import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiVaultState } from "./hooks/useApiVaultState";
import { ApiVaultHeader } from "./components/ApiVaultHeader";
import { ApiVaultContent } from "./components/ApiVaultContent";
import { ApiVaultDialogsContainer } from "./components/ApiVaultDialogsContainer";
import { ApiKeyStats } from "./types";
import { toast } from "sonner";
import { calculateKeyStats, groupKeysByService } from "./hooks/useApiKeyFilters";
import { HeliusIntegrationButton } from "./HeliusIntegrationButton";
import { AddHeliusButton } from "./AddHeliusButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ApiVaultCard() {
  const {
    storageState,
    isLocked,
    setIsLocked,
    isRecovering,
    setIsRecovering,
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
    activeTab,
    setActiveTab,
    apiKeys,
    setApiKeys,
    searchTerm,
    setSearchTerm,
    filterService,
    setFilterService,
    isKeyVisible,
    toggleKeyVisibility,
    addNewKey,
    deleteKey,
    updateKey,
    handleImport,
    getFilteredKeys,
    getKeysByService,
    handleLock,
    handleRecoverClick,
    isTestingKeys,
    handleRefreshKeys,
  } = useApiVaultState();

  const keyStats: ApiKeyStats = calculateKeyStats(apiKeys);
  const serviceStats = groupKeysByService(apiKeys);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const state = useApiVaultState();

  if (!state) {
    return <div>Φόρτωση...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Κλειδοθήκη API</CardTitle>
            <CardDescription>
              Διαχείριση των κλειδιών σας API με ασφάλεια
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <AddHeliusButton />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
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
      </CardContent>

      <ApiVaultDialogsContainer
        isLocked={isLocked}
        isUnlocking={isUnlocking}
        setIsUnlocking={setIsUnlocking}
        showImportDialog={showImportDialog}
        setShowImportDialog={setShowImportDialog}
        showExportSheet={showExportSheet}
        setShowExportSheet={setShowExportSheet}
        showSettingsDialog={showSettingsDialog}
        setShowSettingsDialog={setShowSettingsDialog}
        showDialogApiKey={showDialogApiKey}
        setShowDialogApiKey={setShowDialogApiKey}
        addNewKey={addNewKey}
        updateKey={updateKey}
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
        testKeyFunctionality={state.testKeyFunctionality}
      />
    </Card>
  );
}
