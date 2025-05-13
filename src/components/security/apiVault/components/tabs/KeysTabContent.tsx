
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { ApiVaultContent as ApiKeyContent } from "../../ApiVaultContent";
import { ApiKey } from "../../types";

interface KeysTabContentProps {
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
  onImportClick?: () => void;
}

export const KeysTabContent: React.FC<KeysTabContentProps> = (props) => {
  return (
    <TabsContent value="keys" className="mt-0">
      <ApiKeyContent {...props} />
    </TabsContent>
  );
};
