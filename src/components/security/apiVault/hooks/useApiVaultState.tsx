import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { ApiKey } from "../types";
import { useApiKeyManagement } from "./useApiKeyManagement";
import { useVaultSecurity } from "./useVaultSecurity";
import { useVaultRecovery } from "./useVaultRecovery";
import { useKeyTesting } from "./useKeyTesting";
import { useVaultDialogs } from "./useVaultDialogs";
import { useApiKeyStorage } from "./useApiKeyStorage";

export function useApiVaultState() {
  const [activeTab, setActiveTab] = useState("keys");
  const [recoveredKeys, setRecoveredKeys] = useState<ApiKey[]>([]);
  const [recoveryLocations, setRecoveryLocations] = useState<{ storageKey: string; count: number }[]>([]);
  
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
  } = useKeyTesting(apiKeys, setApiKeys, testKeyFunctionality);
  
  // Recovery handling
  const {
    isRecovering,
    setIsRecovering,
    handleRecoverClick
  } = useVaultRecovery({
    apiKeys,
    isRecovering: false,
    setIsRecovering: useState<boolean>(false)[1],
    setRecoveredKeys,
    setRecoveryLocations,
    setShowRecoveryDialog: useState<boolean>(false)[1]
  });
  
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

  // Handle recovery import
  const handleRecoveredImport = useCallback((keys: ApiKey[]) => {
    if (keys.length === 0) {
      toast.error("Δεν υπάρχουν κλειδιά για εισαγωγή");
      return;
    }
    
    try {
      // Filter out duplicates
      const newKeys = keys.filter(recoveredKey => 
        !apiKeys.some(existingKey => existingKey.key === recoveredKey.key)
      );
      
      if (newKeys.length === 0) {
        toast.info("Όλα τα ανακτηθέντα κλειδιά υπάρχουν ήδη");
        return;
      }
      
      // Add the new keys
      setApiKeys(prev => [...prev, ...newKeys]);
      toast.success(`Εισαγωγή ${newKeys.length} ανακτηθέντων κλειδιών`);
      setShowRecoveryDialog(false);
    } catch (e) {
      console.error("Σφάλμα κατά την εισαγωγή ανακτηθέντων κλειδιών:", e);
      toast.error("Σφάλμα κατά την εισαγωγή κλειδιών");
    }
  }, [apiKeys, setApiKeys, setShowRecoveryDialog]);
  
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
    handleRefreshKeys,
    
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
