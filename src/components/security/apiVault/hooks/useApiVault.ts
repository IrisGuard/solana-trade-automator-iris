
import { useApiKeyManagement } from "./useApiKeyManagement";
import { useVaultSecurity } from "./useVaultSecurity";
import { useVaultDialogs } from "./useVaultDialogs";

export function useApiVault() {
  const keyManagement = useApiKeyManagement();
  const dialogs = useVaultDialogs();
  const security = useVaultSecurity({ 
    apiKeys: keyManagement.apiKeys, 
    setApiKeys: keyManagement.setApiKeys 
  });

  return {
    // Key Management
    apiKeys: keyManagement.apiKeys,
    isKeyVisible: keyManagement.isKeyVisible,
    searchTerm: keyManagement.searchTerm,
    setSearchTerm: keyManagement.setSearchTerm,
    filterService: keyManagement.filterService,
    setFilterService: keyManagement.setFilterService,
    addNewKey: keyManagement.addNewKey,
    deleteKey: keyManagement.deleteKey,
    toggleKeyVisibility: keyManagement.toggleKeyVisibility,
    handleImport: keyManagement.handleImport,
    getFilteredKeys: keyManagement.getFilteredKeys,
    getKeysByService: keyManagement.getKeysByService,
    
    // Dialog Management
    showDialogApiKey: dialogs.showDialogApiKey,
    setShowDialogApiKey: dialogs.setShowDialogApiKey,
    showImportDialog: dialogs.showImportDialog,
    setShowImportDialog: dialogs.setShowImportDialog,
    showExportSheet: dialogs.showExportSheet,
    setShowExportSheet: dialogs.setShowExportSheet,
    showSettingsDialog: dialogs.showSettingsDialog,
    setShowSettingsDialog: dialogs.setShowSettingsDialog,
    
    // Security
    isEncryptionEnabled: security.isEncryptionEnabled,
    setIsEncryptionEnabled: security.setIsEncryptionEnabled,
    savedMasterPassword: security.savedMasterPassword,
    setSavedMasterPassword: security.setSavedMasterPassword,
    isLocked: security.isLocked,
    setIsLocked: security.setIsLocked,
    isAutoLockEnabled: security.isAutoLockEnabled,
    setIsAutoLockEnabled: security.setIsAutoLockEnabled,
    autoLockTimeout: security.autoLockTimeout,
    setAutoLockTimeout: security.setAutoLockTimeout,
    isUnlocking: security.isUnlocking,
    setIsUnlocking: security.setIsUnlocking,
    handleUnlock: security.handleUnlock,
    handleLock: security.handleLock,
    saveSecuritySettings: security.saveSecuritySettings
  };
}
