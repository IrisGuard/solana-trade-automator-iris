
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeyFilters } from "./ApiKeyFilters";
import { ApiKeyList } from "./ApiKeyList";
import { ApiKeysByService } from "./ApiKeysByService";
import { EmptyApiVault } from "./components/EmptyApiVault";
import { ApiKeyStats } from "./components/ApiKeyStats";
import { ApiKey, ServiceInfo } from "./types";

interface ApiVaultContentProps {
  apiKeys: ApiKey[];
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
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
}

export const ApiVaultContent: React.FC<ApiVaultContentProps> = ({
  apiKeys,
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
  setApiKeys
}) => {
  if (apiKeys.length === 0) {
    return <EmptyApiVault onAddKeyClick={onAddKeyClick} />;
  }

  // Calculate statistics for keys
  const keyStats = {
    total: apiKeys.length,
    active: apiKeys.filter(key => key.status === "active" || !key.status).length,
    expired: apiKeys.filter(key => key.status === "expired").length,
    revoked: apiKeys.filter(key => key.status === "revoked").length,
  };

  // Get unique services and their counts
  const serviceStats: ServiceInfo[] = Object.entries(getKeysByService()).map(([name, keys]) => ({
    name,
    count: keys.length,
  }));

  return (
    <div className="space-y-4">
      <ApiKeyFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterService={filterService}
        setFilterService={setFilterService}
      />
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="list">Λίστα</TabsTrigger>
          <TabsTrigger value="groups">Ανά Υπηρεσία</TabsTrigger>
          <TabsTrigger value="stats">Στατιστικά</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <ApiKeyList 
            apiKeys={getFilteredKeys()}
            isKeyVisible={isKeyVisible}
            toggleKeyVisibility={toggleKeyVisibility}
            deleteKey={deleteKey}
            setApiKeys={setApiKeys}
          />
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-6">
          <ApiKeysByService 
            keysByService={getKeysByService()}
            isKeyVisible={isKeyVisible}
            toggleKeyVisibility={toggleKeyVisibility}
            deleteKey={deleteKey}
            setApiKeys={setApiKeys}
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <ApiKeyStats stats={keyStats} services={serviceStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
