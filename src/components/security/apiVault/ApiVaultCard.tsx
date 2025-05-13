import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiVaultHeader } from "./components/ApiVaultHeader";
import { ApiVaultContent } from "./components/ApiVaultContent";
import { ApiVaultDialogsContainer } from "./components/ApiVaultDialogsContainer";
import { useApiVaultState } from "./hooks/useApiVaultState";

export const ApiVaultCard = () => {
  // Use the centralized state management hook
  const state = useApiVaultState();

  return (
    <Card>
      <CardHeader className="px-6 pt-6 pb-4">
        <ApiVaultHeader 
          onAddKey={() => state.setShowDialogApiKey(true)}
          onImport={() => state.setShowImportDialog(true)}
          onExport={() => state.setShowExportSheet(true)}
          apiKeysCount={state.apiKeys.length}
          onSettings={() => state.setShowSettingsDialog(true)}
          isLocked={state.isLocked}
          isEncryptionEnabled={state.isEncryptionEnabled}
          onUnlock={() => state.setIsUnlocking(true)}
          onLock={state.handleLock}
        />
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-6">
          {/* Show error state if there are storage errors */}
          {state.renderStorageErrorState && state.renderStorageErrorState()}
          
          {/* Key management content */}
          <ApiVaultContent 
            // Tab state
            activeTab={state.activeTab}
            setActiveTab={state.setActiveTab}
            
            // Key Management
            apiKeys={state.apiKeys}
            setApiKeys={state.setApiKeys}
            searchTerm={state.searchTerm}
            setSearchTerm={state.setSearchTerm}
            filterService={state.filterService}
            setFilterService={state.setFilterService}
            
            // Visibility
            isKeyVisible={state.isKeyVisible}
            toggleKeyVisibility={state.toggleKeyVisibility}
            deleteKey={state.deleteKey}
            getFilteredKeys={state.getFilteredKeys}
            getKeysByService={state.getKeysByService}
            
            // Stats
            keyStats={state.keyStats}
            serviceStats={state.serviceStats}
            
            // Security
            isLocked={state.isLocked}
            
            // Recovery
            isRecovering={state.isRecovering}
            isTestingKeys={state.isTestingKeys}
            handleRefreshKeys={state.handleRefreshKeys}
            handleRecoverClick={state.handleRecoverClick}
            
            // Dialog controls
            setShowImportDialog={state.setShowImportDialog}
            setShowExportSheet={state.setShowExportSheet}
            setShowSettingsDialog={state.setShowSettingsDialog}
            setIsUnlocking={state.setIsUnlocking}
            setShowDialogApiKey={state.setShowDialogApiKey}
            handleLock={state.handleLock}
            
            // Additional error state props
            storageState={state.storageState}
          />
          
          {/* All dialogs */}
          <ApiVaultDialogsContainer 
            // Dialog states
            showDialogApiKey={state.showDialogApiKey}
            setShowDialogApiKey={state.setShowDialogApiKey}
            showImportDialog={state.showImportDialog}
            setShowImportDialog={state.setShowImportDialog}
            showExportSheet={state.showExportSheet}
            setShowExportSheet={state.setShowExportSheet}
            showSettingsDialog={state.showSettingsDialog}
            setShowSettingsDialog={state.setShowSettingsDialog}
            showRecoveryDialog={state.showRecoveryDialog}
            setShowRecoveryDialog={state.setShowRecoveryDialog}
            isUnlocking={state.isUnlocking}
            setIsUnlocking={state.setIsUnlocking}
            
            // Key management
            apiKeys={state.apiKeys}
            addNewKey={state.addNewKey}
            handleImport={state.handleImport}
            
            // Security
            handleUnlock={state.handleUnlock}
            savedMasterPassword={state.savedMasterPassword}
            isEncryptionEnabled={state.isEncryptionEnabled}
            setIsEncryptionEnabled={state.setIsEncryptionEnabled}
            isAutoLockEnabled={state.isAutoLockEnabled}
            setIsAutoLockEnabled={state.setIsAutoLockEnabled}
            autoLockTimeout={state.autoLockTimeout}
            setAutoLockTimeout={state.setAutoLockTimeout}
            setSavedMasterPassword={state.setSavedMasterPassword}
            
            // Recovery
            recoveredKeys={state.recoveredKeys}
            recoveryLocations={state.recoveryLocations}
            handleRecoveredImport={state.handleRecoveredImport}
            
            // Recovery methods
            recoverFromBackup={state.recoverFromBackup}
          />
        </div>
      </CardContent>
    </Card>
  );
};
