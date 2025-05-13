
import { useState, useMemo } from "react";
import { ApiKey } from "../types";
import { useApiKeyManagement } from "./useApiKeyManagement";
import { useVaultSecurity } from "./useVaultSecurity";
import { useVaultRecovery } from "./useVaultRecovery";
import { useKeyTestingState } from "./useKeyTestingState";
import { useVaultDialogs } from "./useVaultDialogs";
import { useApiKeyStorage } from "./useApiKeyStorage";
import { useRecoveredKeysImport } from "./useRecoveredKeysImport";

export function useApiVaultState() {
  const [activeTab, setActiveTab] = useState("keys");
  const [isRecovering, setIsRecovering] = useState(false);
  
  // Key management
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
  
  // Storage handling with error states
  const {
    testKeyFunctionality,
    recoverFromBackup,
    storageState
  } = useApiKeyStorage(apiKeys, setApiKeys);
  
  // Security management
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
  
  // Test keys functionality
  const {
    isTestingKeys,
    handleRefreshKeys
  } = useKeyTestingState();
  
  // Dialog management
  const {
    showDialogApiKey,
    setShowDialogApiKey,
    showImportDialog,
    setShowImportDialog,
    showExportSheet,
    setShowExportSheet,
    showSettingsDialog,
    setShowSettingsDialog,
    showRecoveryDialog,
    setShowRecoveryDialog
  } = useVaultDialogs();
  
  // Recovery handling
  const {
    recoveredKeys,
    recoveryLocations,
    handleRecoverClick
  } = useVaultRecovery({ apiKeys });
  
  // Recovered keys import handling
  const { 
    handleRecoveredImport 
  } = useRecoveredKeysImport({
    apiKeys,
    setApiKeys,
    setShowRecoveryDialog
  });
  
  // Computed key statistics
  const keyStats = useMemo(() => ({
    total: apiKeys.length,
    active: apiKeys.filter(key => key.status === "active" || !key.status).length,
    expired: apiKeys.filter(key => key.status === "expired").length,
    revoked: apiKeys.filter(key => key.status === "revoked").length,
  }), [apiKeys]);
  
  // Service statistics
  const serviceStats = useMemo(() => {
    const keysByService = getKeysByService();
    return Object.entries(keysByService).map(([name, keys]) => ({
      name,
      count: keys.length,
    }));
  }, [getKeysByService]);

  // Create a refreshKeys handler that works with our key testing state
  const refreshKeysHandler = () => {
    handleRefreshKeys(apiKeys, setApiKeys, testKeyFunctionality);
  };

  return {
    // Tab state
    activeTab,
    setActiveTab,
    
    // Key management
    apiKeys,
    setApiKeys,
    addNewKey,
    deleteKey,
    updateKey,
    handleImport,
    
    // Error handling & storage state
    storageState,
    recoverFromBackup,
    
    // Key visibility
    isKeyVisible,
    toggleKeyVisibility,
    
    // Search and filtering
    searchTerm,
    setSearchTerm,
    filterService,
    setFilterService,
    getFilteredKeys,
    getKeysByService,
    
    // Statistics
    keyStats,
    serviceStats,
    
    // Security
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
    handleUnlock,
    handleLock,
    saveSecuritySettings,
    isUnlocking,
    setIsUnlocking,
    
    // Testing functionality
    isTestingKeys,
    handleRefreshKeys: refreshKeysHandler,
    testKeyFunctionality,
    
    // Recovery
    isRecovering,
    setIsRecovering,
    handleRecoverClick,
    recoveredKeys,
    recoveryLocations,
    handleRecoveredImport,
    
    // Dialogs
    showDialogApiKey,
    setShowDialogApiKey,
    showImportDialog,
    setShowImportDialog,
    showExportSheet,
    setShowExportSheet,
    showSettingsDialog,
    setShowSettingsDialog,
    showRecoveryDialog,
    setShowRecoveryDialog
  };
}
