
import { useState, useEffect } from "react";
import { ApiKey } from "../types";
import { useApiKeyManagement } from "./useApiKeyManagement";
import { useApiKeyVisibility } from "./useApiKeyVisibility";
import { useVaultSecurity } from "./useVaultSecurity";
import { useVaultState } from "./useVaultState";
import { useVaultRecovery } from "./useVaultRecovery";
import { useKeyOperations } from "./useKeyOperations";
import { useKeyTesting } from "./useKeyTesting";

export const useApiVaultState = () => {
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

  return {
    // Dialog states
    showDialogApiKey, setShowDialogApiKey,
    showImportDialog, setShowImportDialog,
    showExportSheet, setShowExportSheet,
    showSettingsDialog, setShowSettingsDialog,
    showRecoveryDialog, setShowRecoveryDialog,
    
    // Tab state
    activeTab, setActiveTab,
    
    // Recovery state
    isRecovering, setIsRecovering,
    recoveredKeys, setRecoveredKeys,
    recoveryLocations, setRecoveryLocations,
    isTestingKeys, setIsTestingKeys,
    
    // Key management
    apiKeys, setApiKeys,
    searchTerm, setSearchTerm,
    filterService, setFilterService,
    addNewKey, deleteKey, updateKey,
    handleImport, getFilteredKeys, getKeysByService,
    
    // Key testing
    handleRefreshKeys,
    
    // Visibility
    isKeyVisible, toggleKeyVisibility,
    
    // Security
    isEncryptionEnabled, setIsEncryptionEnabled,
    savedMasterPassword, setSavedMasterPassword,
    isLocked, setIsLocked,
    isAutoLockEnabled, setIsAutoLockEnabled,
    autoLockTimeout, setAutoLockTimeout,
    isUnlocking, setIsUnlocking,
    handleUnlock, handleLock,
    saveSecuritySettings,
    
    // Recovery and operations
    handleRecoverClick,
    handleRecoveredImport,
    
    // Stats
    keyStats,
    serviceStats
  };
};
