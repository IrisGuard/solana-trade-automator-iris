
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  tab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ tab, onTabChange }: TabNavigationProps) {
  return (
    <TabsList className="grid grid-cols-3 mb-4">
      <TabsTrigger 
        value="settings" 
        onClick={() => onTabChange("settings")}
        data-state={tab === "settings" ? "active" : ""}
      >
        Ρυθμίσεις
      </TabsTrigger>
      <TabsTrigger 
        value="orders" 
        onClick={() => onTabChange("orders")}
        data-state={tab === "orders" ? "active" : ""}
      >
        Εντολές
      </TabsTrigger>
      <TabsTrigger 
        value="history" 
        onClick={() => onTabChange("history")}
        data-state={tab === "history" ? "active" : ""}
      >
        Ιστορικό
      </TabsTrigger>
    </TabsList>
  );
}
