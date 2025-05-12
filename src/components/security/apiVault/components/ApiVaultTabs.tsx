
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ApiKeyStats } from "./ApiKeyStats";
import { ServiceStats } from "./ServiceStats";
import { ApiVaultContent } from "../ApiVaultContent";
import { ApiKey, ApiKeyStats as ApiKeyStatsType, ServiceInfo } from "../types";

interface ApiVaultTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiKeys: ApiKey[];
  isLocked: boolean;
  keyStats: ApiKeyStatsType;
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
  handleRecoverClick
}) => {
  return (
    <>
      {!isLocked && apiKeys.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="keys">Κλειδιά API</TabsTrigger>
            <TabsTrigger value="stats">Στατιστικά</TabsTrigger>
            <TabsTrigger value="services">Υπηρεσίες</TabsTrigger>
          </TabsList>
          <TabsContent value="keys" className="space-y-4">
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
            />
          </TabsContent>
          <TabsContent value="stats">
            <ApiKeyStats stats={keyStats} services={services} />
          </TabsContent>
          <TabsContent value="services">
            <ServiceStats services={services} />
          </TabsContent>
        </Tabs>
      )}
      
      {(isLocked || apiKeys.length === 0) && (
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
        />
      )}

      {!isLocked && apiKeys.length > 0 && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshKeys}
            disabled={isTestingKeys}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isTestingKeys ? 'animate-spin' : ''}`} />
            Έλεγχος κλειδιών
          </Button>
        </div>
      )}
    </>
  );
};
