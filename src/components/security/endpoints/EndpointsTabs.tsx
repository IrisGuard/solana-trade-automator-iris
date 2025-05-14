
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiEndpoint } from "@/types/api";
import { EndpointsList } from "./EndpointsList";

interface EndpointsTabsProps {
  groupedEndpoints: Record<string, ApiEndpoint[]>;
  categories: string[];
  onEdit: (endpoint: ApiEndpoint) => void;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
  onAddNew: () => void;
}

export function EndpointsTabs({ 
  groupedEndpoints, 
  categories, 
  onEdit, 
  onDelete, 
  loading,
  onAddNew
}: EndpointsTabsProps) {
  const [activeTab, setActiveTab] = useState(categories[0] || "");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        {categories.map(category => (
          <TabsTrigger key={category} value={category} className="capitalize">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {categories.map(category => (
        <TabsContent key={category} value={category} className="space-y-4">
          <EndpointsList 
            endpoints={groupedEndpoints[category]} 
            onEdit={onEdit}
            onDelete={onDelete}
            loading={loading}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
