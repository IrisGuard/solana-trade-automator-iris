
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKey, ApiKeyStats, ServiceInfo } from "../../types";

interface TabViewProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
  tabItems: { value: string; label: string }[];
}

export const TabView: React.FC<TabViewProps> = ({
  activeTab,
  onTabChange,
  children,
  tabItems
}) => {
  return (
    <Tabs 
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabItems.length}, 1fr)` }}>
        {tabItems.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
};
