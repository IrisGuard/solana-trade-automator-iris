
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";
import { useTradingBot } from "@/hooks/useTradingBot";
import { Loader, TrendingUp } from "lucide-react";
import { SettingsTab } from "./trading-bot/SettingsTab";
import { OrdersTab } from "./trading-bot/OrdersTab";
import { HistoryTab } from "./trading-bot/HistoryTab";
import { StatusCard } from "./trading-bot/StatusCard";
import { Order } from "@/types/orders";

export function TradingBotTab() {
  const {
    config,
    updateConfig,
    startBot,
    stopBot,
    selectToken,
    isLoading,
    botStatus,
    activeOrders,
    selectedTokenPrice,
    selectedTokenDetails,
    connected,
    tokens
  } = useTradingBot();
  
  const [tab, setTab] = useState("settings");
  
  // Handle connect wallet
  const handleConnectWallet = () => {
    // This is handled by the WalletMultiButton component
  };
  
  if (!connected) {
    return (
      <TabsContent value="trading-bot" className="space-y-4">
        <ConnectPrompt 
          handleConnectWallet={handleConnectWallet} 
          size="large"
        />
      </TabsContent>
    );
  }
  
  return (
    <TabsContent value="trading-bot" className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Trading Bot</span>
              {botStatus === 'running' && (
                <div className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded border border-green-200">
                  Ενεργό
                </div>
              )}
            </CardTitle>
            <CardDescription>Αυτοματοποιημένο trading με stop-loss και take-profit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="settings">Ρυθμίσεις</TabsTrigger>
                <TabsTrigger value="orders">Εντολές</TabsTrigger>
                <TabsTrigger value="history">Ιστορικό</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings">
                <SettingsTab 
                  config={config}
                  updateConfig={updateConfig}
                  selectToken={selectToken}
                  selectedTokenPrice={selectedTokenPrice}
                  selectedTokenDetails={selectedTokenDetails}
                  tokens={tokens}
                />
              </TabsContent>
              
              <TabsContent value="orders">
                <OrdersTab activeOrders={activeOrders as unknown as Order[]} />
              </TabsContent>
              
              <TabsContent value="history">
                <HistoryTab />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            {botStatus === 'running' ? (
              <Button 
                variant="destructive" 
                onClick={stopBot}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                Διακοπή Bot
              </Button>
            ) : (
              <Button 
                variant="default" 
                onClick={startBot}
                disabled={isLoading || !config.selectedToken}
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                Εκκίνηση Bot
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Status Card */}
        <StatusCard
          botStatus={botStatus}
          selectedTokenDetails={selectedTokenDetails}
          selectedTokenPrice={selectedTokenPrice}
          activeOrders={activeOrders}
        />
      </div>
    </TabsContent>
  );
}
