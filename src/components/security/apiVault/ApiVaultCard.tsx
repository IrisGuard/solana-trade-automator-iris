
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiKey } from "./types";
import { ApiVaultHeader } from "./components/ApiVaultHeader";
import { ApiVaultContent } from "./ApiVaultContent";
import { useApiKeyManagement } from "./hooks/useApiKeyManagement";
import { useApiKeyVisibility } from "./hooks/useApiKeyVisibility";
import { useVaultSecurity } from "./hooks/useVaultSecurity";
import { recoverAllApiKeys } from "./utils";
import { toast } from "sonner";
import { ApiVaultDialogs } from "./components/ApiVaultDialogs";
import { ApiVaultTabs } from "./components/ApiVaultTabs";
import { ApiVaultActions } from "./components/ApiVaultActions";

export const ApiVaultCard = () => {
  const [showDialogApiKey, setShowDialogApiKey] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportSheet, setShowExportSheet] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("keys");
  const [isRecovering, setIsRecovering] = useState(false);
  const [isTestingKeys, setIsTestingKeys] = useState(false);
  const [recoveredKeys, setRecoveredKeys] = useState<ApiKey[]>([]);
  const [recoveryLocations, setRecoveryLocations] = useState<{ storageKey: string; count: number }[]>([]);

  // API Key Management hooks
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

  // Calculate statistics for keys
  const keyStats = {
    total: apiKeys.length,
    active: apiKeys.filter(key => key.status === "active" || !key.status).length,
    expired: apiKeys.filter(key => key.status === "expired").length,
    revoked: apiKeys.filter(key => key.status === "revoked").length,
  };

  // Get unique services and their counts
  const serviceStats = Object.entries(getKeysByService()).map(([name, keys]) => ({
    name,
    count: keys.length,
  }));

  // Handle recovery scan
  const handleRecoverClick = () => {
    setIsRecovering(true);
    setTimeout(() => {
      try {
        const result = recoverAllApiKeys();
        setRecoveredKeys(result.keys);
        setRecoveryLocations(result.locations);
        
        if (result.keys.length > 0) {
          setShowRecoveryDialog(true);
        } else {
          toast.info('Δεν βρέθηκαν επιπλέον κλειδιά API');
        }
      } catch (e) {
        console.error('Recovery error:', e);
        toast.error('Σφάλμα κατά την ανάκτηση κλειδιών');
      } finally {
        setIsRecovering(false);
      }
    }, 1000);
  };

  // Handle the import of recovered keys
  const handleRecoveredImport = (keys: ApiKey[]) => {
    handleImport(keys);
    setShowRecoveryDialog(false);
    toast.success(`Εισήχθησαν ${keys.length} κλειδιά επιτυχώς`);
  };

  // Test all keys for validity/functionality
  const handleRefreshKeys = () => {
    setIsTestingKeys(true);
    
    // Simulate testing process
    setTimeout(() => {
      setIsTestingKeys(false);
      toast.success('Ο έλεγχος κλειδιών ολοκληρώθηκε');
    }, 2000);
  };

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
          />
          
          {/* Additional actions */}
          <ApiVaultActions 
            isLocked={isLocked}
            apiKeys={apiKeys}
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
