
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsTab } from "./SettingsTab";
import { MonitorTab } from "./MonitorTab";
import { HistoryTab } from "./HistoryTab";
import { OrdersTab } from "./OrdersTab";
import { StrategyTab } from "./StrategyTab";
import { BotStatus } from "@/components/wallet/trading-bot/components/BotStatus";

interface TradingBotContentProps {
  tradingBotState: any;
  tab: string;
  setTab: (tab: string) => void;
}

export function TradingBotContent({
  tradingBotState,
  tab,
  setTab
}: TradingBotContentProps) {
  const { 
    isActive, 
    toggleActive, 
    isLoading,
    selectedStrategy,
    selectedToken,
    tradingAmount,
    profitTarget,
    stopLoss
  } = tradingBotState;
  
  return (
    <div className="space-y-6">
      {/* Status Card */}
      <BotStatus 
        isActive={isActive}
        isLoading={isLoading}
        onToggle={toggleActive}
      />
      
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="settings">Ρυθμίσεις</TabsTrigger>
          <TabsTrigger value="strategy">Στρατηγική</TabsTrigger>
          <TabsTrigger value="monitor">Παρακολούθηση</TabsTrigger>
          <TabsTrigger value="orders">Εντολές</TabsTrigger>
          <TabsTrigger value="history">Ιστορικό</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4">
          <SettingsTab />
        </TabsContent>
        
        <TabsContent value="strategy" className="space-y-4">
          <StrategyTab />
        </TabsContent>
        
        <TabsContent value="monitor" className="space-y-4">
          <MonitorTab />
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <OrdersTab />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <HistoryTab />
        </TabsContent>
      </Tabs>
      
      {/* Bot configuration summary */}
      <div className="mt-6 p-4 rounded-lg bg-card border border-border/50">
        <h4 className="text-sm font-medium mb-3">Τρέχουσες Ρυθμίσεις Bot</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Στρατηγική</div>
            <div className="font-medium">{selectedStrategy || "Δεν έχει οριστεί"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Token</div>
            <div className="font-medium">{selectedToken || "Δεν έχει οριστεί"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Ποσό Συναλλαγών</div>
            <div className="font-medium">{tradingAmount || "Δεν έχει οριστεί"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Στόχος Κέρδους</div>
            <div className="font-medium">{profitTarget || "Δεν έχει οριστεί"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
