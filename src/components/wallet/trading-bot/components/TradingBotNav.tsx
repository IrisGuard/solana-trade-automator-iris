
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TradingBotNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TradingBotNav({ activeTab, onTabChange }: TradingBotNavProps) {
  return (
    <TabsList>
      <TabsTrigger 
        value="settings" 
        onClick={() => onTabChange("settings")}
        data-state={activeTab === "settings" ? "active" : ""}
      >
        Ρυθμίσεις
      </TabsTrigger>
      <TabsTrigger 
        value="monitor" 
        onClick={() => onTabChange("monitor")}
        data-state={activeTab === "monitor" ? "active" : ""}
      >
        Παρακολούθηση
      </TabsTrigger>
      <TabsTrigger 
        value="orders" 
        onClick={() => onTabChange("orders")}
        data-state={activeTab === "orders" ? "active" : ""}
      >
        Εντολές
      </TabsTrigger>
      <TabsTrigger 
        value="history" 
        onClick={() => onTabChange("history")}
        data-state={activeTab === "history" ? "active" : ""}
      >
        Ιστορικό
      </TabsTrigger>
    </TabsList>
  );
}
