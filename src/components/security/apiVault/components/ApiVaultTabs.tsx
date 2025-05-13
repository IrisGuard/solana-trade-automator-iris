
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { LockedVaultState } from "../LockedVaultState";
import { ApiKey, ApiKeyStats, ServiceInfo } from "../types";
import { TabView } from "./tabs/TabView";
import { KeysTabContent } from "./tabs/KeysTabContent";

interface ApiVaultTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiKeys: ApiKey[];
  isLocked: boolean;
  keyStats: ApiKeyStats;
  services: ServiceInfo[];
  isTestingKeys: boolean;
  handleRefreshKeys: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterService: string;
  setFilterService: (service: string) => void;
  isKeyVisible: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  deleteKey: (id: string) => void;
  getFilteredKeys: () => ApiKey[];
  getKeysByService: () => Record<string, ApiKey[]>;
  onAddKeyClick: () => void;
  onUnlockClick: () => void;
  handleRecoverClick: () => void;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
}

export const ApiVaultTabs: React.FC<ApiVaultTabsProps> = ({
  activeTab,
  setActiveTab,
  apiKeys,
  isLocked,
  keyStats,
  services,
  isTestingKeys,
  handleRefreshKeys,
  searchTerm,
  setSearchTerm,
  filterService,
  setFilterService,
  isKeyVisible,
  toggleKeyVisibility,
  deleteKey,
  getFilteredKeys,
  getKeysByService,
  onAddKeyClick,
  onUnlockClick,
  handleRecoverClick,
  setApiKeys
}) => {
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLocked) {
    return (
      <LockedVaultState onUnlockClick={onUnlockClick} />
    );
  }

  // Define available tabs
  const tabItems = [
    { value: "keys", label: "Κλειδιά" }
  ];

  return (
    <TabView 
      activeTab={activeTab} 
      onTabChange={handleTabChange}
      tabItems={tabItems}
    >
      <KeysTabContent 
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
        onAddKeyClick={onAddKeyClick}
        setApiKeys={setApiKeys}
        onImportClick={() => setActiveTab("import")}
      />
      
      {/* Additional tabs can be added here in the future */}
    </TabView>
  );
};
