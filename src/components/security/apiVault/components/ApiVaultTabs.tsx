
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiVaultContent } from "../ApiVaultContent";
import { LockedVaultState } from "../LockedVaultState";
import { ApiKey, ApiKeyStats, ServiceInfo } from "../types";

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

  return (
    <Tabs 
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsContent value="keys" className="mt-0">
        <ApiVaultContent 
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
      </TabsContent>
    </Tabs>
  );
};
