
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useApiVault } from "./hooks/useApiVault";
import { ApiVaultHeader } from "./ApiVaultHeader";
import { ApiVaultContent } from "./ApiVaultContent";
import { NewApiKeyDialog } from "./NewApiKeyDialog";
import { ImportDialog } from "./ImportDialog";
import { ExportSheet } from "./ExportSheet";
import { SecuritySettingsDialog } from "./SecuritySettingsDialog";
import { UnlockDialog } from "./UnlockDialog";
import { ApiKeyStats } from "./components/ApiKeyStats";
import { ServiceStats } from "./components/ServiceStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  const [activeTab, setActiveTab] = useState<string>("keys");

  // Calculate key statistics
  const keyStats = {
    total: apiKeys.length,
    active: apiKeys.filter(key => !key.status || key.status === "active").length,
    expired: apiKeys.filter(key => key.status === "expired").length,
    revoked: apiKeys.filter(key => key.status === "revoked").length,
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
    if (!key.isWorking === false) {
      acc[key.service].workingCount += 1;
    }
    return acc;
  }, {} as Record<string, {name: string, count: number, workingCount: number}>);

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
        {!isLocked && apiKeys.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="keys">Κλειδιά API</TabsTrigger>
              <TabsTrigger value="stats">Στατιστικά</TabsTrigger>
              <TabsTrigger value="services">Υπηρεσίες</TabsTrigger>
            </TabsList>
            <TabsContent value="keys" className="space-y-4">
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
            </TabsContent>
            <TabsContent value="stats">
              <ApiKeyStats stats={keyStats} />
            </TabsContent>
            <TabsContent value="services">
              <ServiceStats services={Object.values(services)} />
            </TabsContent>
          </Tabs>
        )}
        
        {(isLocked || apiKeys.length === 0) && (
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
        )}

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
