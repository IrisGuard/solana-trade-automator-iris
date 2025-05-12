
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeyFilters } from "./ApiKeyFilters";
import { ApiKeyList } from "./ApiKeyList";
import { ApiKeysByService } from "./ApiKeysByService";
import { EmptyVaultState } from "./EmptyVaultState";
import { LockedVaultState } from "./LockedVaultState";

interface ApiVaultContentProps {
  isLocked: boolean;
  apiKeys: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterService: string;
  setFilterService: (service: string) => void;
  isKeyVisible: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  deleteKey: (id: string) => void;
  getFilteredKeys: () => any[];
  getKeysByService: () => Record<string, any[]>;
  onAddKeyClick: () => void;
  onUnlockClick: () => void;
  onRecoverClick?: () => void;
}

export const ApiVaultContent: React.FC<ApiVaultContentProps> = ({
  isLocked,
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
  onUnlockClick,
  onRecoverClick
}) => {
  if (isLocked) {
    return <LockedVaultState onUnlockClick={onUnlockClick} />;
  }

  if (apiKeys.length === 0) {
    return <EmptyVaultState onAddKeyClick={onAddKeyClick} onRecoverClick={onRecoverClick} />;
  }

  return (
    <div className="space-y-4">
      <ApiKeyFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterService={filterService}
        setFilterService={setFilterService}
      />
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="list">Λίστα</TabsTrigger>
          <TabsTrigger value="groups">Ανά Υπηρεσία</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <ApiKeyList 
            apiKeys={getFilteredKeys()}
            isKeyVisible={isKeyVisible}
            toggleKeyVisibility={toggleKeyVisibility}
            deleteKey={deleteKey}
          />
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-6">
          <ApiKeysByService 
            keysByService={getKeysByService()}
            isKeyVisible={isKeyVisible}
            toggleKeyVisibility={toggleKeyVisibility}
            deleteKey={deleteKey}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
