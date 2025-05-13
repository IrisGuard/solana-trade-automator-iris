
import React from "react";
import { ApiVaultTabs } from "./ApiVaultTabs";
import { ApiVaultActions } from "./ApiVaultActions";
import { ApiKey, ApiKeyStats, ServiceInfo } from "../types";
import { ApiKeyStorageState } from "../hooks/useApiKeyStorage";
import { Loader2 } from "lucide-react";
import { ApiStorageError } from "./ApiStorageError";

interface ApiVaultContentProps {
  // Tab state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Key Management
  apiKeys: ApiKey[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterService: string;
  setFilterService: (service: string) => void;
  
  // Visibility
  isKeyVisible: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  deleteKey: (id: string) => void;
  getFilteredKeys: () => ApiKey[];
  getKeysByService: () => Record<string, ApiKey[]>;
  
  // Stats
  keyStats: ApiKeyStats;
  serviceStats: ServiceInfo[];
  
  // Security
  isLocked: boolean;
  
  // Recovery
  isRecovering: boolean;
  isTestingKeys: boolean;
  handleRefreshKeys: () => void;
  handleRecoverClick: () => void;
  
  // Dialog controls
  setShowImportDialog: (show: boolean) => void;
  setShowExportSheet: (show: boolean) => void; 
  setShowSettingsDialog: (show: boolean) => void;
  setIsUnlocking: (unlocking: boolean) => void;
  setShowDialogApiKey: (show: boolean) => void;
  handleLock: () => void;
  
  // Error handling
  storageState?: ApiKeyStorageState;
}

export const ApiVaultContent: React.FC<ApiVaultContentProps> = ({
  // Tab state
  activeTab,
  setActiveTab,
  
  // Key Management
  apiKeys,
  setApiKeys,
  searchTerm,
  setSearchTerm,
  filterService,
  setFilterService,
  
  // Visibility
  isKeyVisible,
  toggleKeyVisibility,
  deleteKey,
  getFilteredKeys,
  getKeysByService,
  
  // Stats
  keyStats,
  serviceStats,
  
  // Security
  isLocked,
  
  // Recovery
  isRecovering,
  isTestingKeys,
  handleRefreshKeys,
  handleRecoverClick,
  
  // Dialog controls
  setShowImportDialog,
  setShowExportSheet,
  setShowSettingsDialog,
  setIsUnlocking,
  setShowDialogApiKey,
  handleLock,
  
  // Error handling
  storageState
}) => {
  // Show loading state if loading data
  if (storageState?.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Φόρτωση κλειδιών...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Error alert from storage if applicable */}
      {storageState?.error && (
        <ApiStorageError storageState={storageState} />
      )}
    
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
        setApiKeys={setApiKeys}
      />
      
      {/* Additional actions */}
      <ApiVaultActions 
        onImportClick={() => setShowImportDialog(true)}
        onExportClick={() => setShowExportSheet(true)}
        onLockClick={isLocked ? () => setIsUnlocking(true) : handleLock}
        onSecurityClick={() => setShowSettingsDialog(true)}
        isLocked={isLocked}
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
        isRecovering={isRecovering}
        isTestingKeys={isTestingKeys}
        handleRecoverClick={handleRecoverClick}
      />
    </div>
  );
};
