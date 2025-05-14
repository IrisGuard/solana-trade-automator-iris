
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EndpointsList } from "./EndpointsList";
import { useGetEndpoints } from "@/hooks/useGetEndpoints";
import { ApiEndpoint } from "@/types/api";

interface ApiEndpointsManagerProps {
  onAddEndpoint?: () => void;
}

export function ApiEndpointsManager({ onAddEndpoint }: ApiEndpointsManagerProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { endpoints, loading, error } = useGetEndpoints();

  // Group endpoints by category
  const groupedEndpoints = React.useMemo(() => {
    if (!endpoints) return {};
    
    return endpoints.reduce((acc: Record<string, ApiEndpoint[]>, endpoint: ApiEndpoint) => {
      const category = endpoint.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(endpoint);
      return acc;
    }, { 'All': endpoints });
  }, [endpoints]);

  // Filter endpoints based on search query
  const filteredEndpoints = React.useMemo(() => {
    if (!groupedEndpoints) return {};
    
    if (!searchQuery) return groupedEndpoints;
    
    const result: Record<string, ApiEndpoint[]> = {};
    
    Object.entries(groupedEndpoints).forEach(([category, endpointsList]) => {
      const filtered = endpointsList.filter(endpoint => 
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filtered.length > 0) {
        result[category] = filtered;
      }
    });
    
    return result;
  }, [groupedEndpoints, searchQuery]);

  // Get unique categories for tabs
  const categories = React.useMemo(() => {
    if (!groupedEndpoints) return ['All'];
    return ['All', ...Object.keys(groupedEndpoints).filter(cat => cat !== 'All')];
  }, [groupedEndpoints]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Endpoints</h2>
        <Button onClick={onAddEndpoint}>
          <Plus className="h-4 w-4 mr-2" />
          Add Endpoint
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search endpoints by name, description or URL"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category} value={category.toLowerCase()}>
            <EndpointsList 
              endpoints={
                activeTab === "all" 
                  ? endpoints 
                  : filteredEndpoints[category] || []
              }
              isLoading={loading}
              error={error}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
