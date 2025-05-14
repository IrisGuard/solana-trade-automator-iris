
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ApiEndpointsManager, ApiEndpoint as ManagerApiEndpoint } from "./ApiEndpointsManager";
import { ApiEndpoint as EndpointApiType } from "@/types/api";

// Helper function to convert between the two types
const convertEndpoints = (endpoints: EndpointApiType[]): ManagerApiEndpoint[] => {
  return endpoints.map(endpoint => ({
    ...endpoint,
    is_active: endpoint.is_active || true,
    is_public: endpoint.is_public || true
  }));
};

export function EndpointsTabs() {
  const [activeTab, setActiveTab] = useState("solana");
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="solana">Solana</TabsTrigger>
        <TabsTrigger value="user">User</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
      </TabsList>
      
      <TabsContent value="solana">
        <ApiEndpointsManager category="solana" />
      </TabsContent>
      
      <TabsContent value="user">
        <ApiEndpointsManager category="user" />
      </TabsContent>
      
      <TabsContent value="system">
        <ApiEndpointsManager category="system" />
      </TabsContent>
    </Tabs>
  );
}

