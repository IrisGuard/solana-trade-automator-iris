
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ApiEndpointsManager } from "./ApiEndpointsManager";

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
