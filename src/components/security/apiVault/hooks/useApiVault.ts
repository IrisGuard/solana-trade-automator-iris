
import { useApiKeyManagement } from "./useApiKeyManagement";
import { useVaultSecurity } from "./useVaultSecurity";
import { useVaultDialogs } from "./useVaultDialogs";
import { useState } from "react";
import { ApiKey } from "../types";
import { recoverAllApiKeys } from "../utils";
import { toast } from "sonner";

export function useApiVault() {
  const keyManagement = useApiKeyManagement();
  const dialogs = useVaultDialogs();
  const security = useVaultSecurity({ 
    apiKeys: keyManagement.apiKeys, 
    setApiKeys: keyManagement.setApiKeys 
  });

  // Νέες καταστάσεις για τη λειτουργία ανάκτησης
  const [isRecovering, setIsRecovering] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveredKeys, setRecoveredKeys] = useState<ApiKey[]>([]);
  const [recoveryLocations, setRecoveryLocations] = useState<{ storageKey: string, count: number }[]>([]);
  
  // Λειτουργία ανάκτησης κλειδιών
  const recoverKeys = () => {
    setIsRecovering(true);
    toast.loading("Αναζήτηση κλειδιών σε εξέλιξη...");
    
    try {
      const result = recoverAllApiKeys();
      
      setRecoveredKeys(result.recoveredKeys);
      setRecoveryLocations(result.locations);
      
      if (result.recoveredKeys.length > 0) {
        setShowRecoveryDialog(true);
        toast.success(`Βρέθηκαν ${result.recoveredKeys.length} κλειδιά σε ${result.locations.length} τοποθεσίες`);
      } else {
        toast.warning("Δεν βρέθηκαν επιπλέον κλειδιά");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την ανάκτηση κλειδιών:", error);
      toast.error("Σφάλμα κατά την αναζήτηση κλειδιών");
    } finally {
      setIsRecovering(false);
    }
  };
  
  // Χειρισμός εισαγωγής ανακτημένων κλειδιών
  const handleRecoveredImport = (keys: ApiKey[]) => {
    keyManagement.handleImport(keys);
    setShowRecoveryDialog(false);
  };

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
    checkKeysFunctionality: keyManagement.checkKeysFunctionality,
    isTestingKeys: keyManagement.isTestingKeys,
    
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
    saveSecuritySettings: security.saveSecuritySettings,
    
    // Νέες λειτουργίες ανάκτησης κλειδιών
    recoverKeys,
    isRecovering,
    showRecoveryDialog,
    setShowRecoveryDialog,
    recoveredKeys,
    recoveryLocations,
    handleRecoveredImport
  };
}
