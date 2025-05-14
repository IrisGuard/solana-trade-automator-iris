
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabHeader } from "./components/TabHeader";
import { TabNavigation } from "./tabs/TabNavigation";
import { ConfigurationPanel } from "./components/ConfigurationPanel";
import { OrdersTab } from "./OrdersTab";
import { HistoryTab } from "./HistoryTab";
import { StatusCard } from "./StatusCard";
import { Order } from "@/types/orders";
import { TradingBotHook } from "@/hooks/trading-bot/types";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface TradingBotContentProps {
  tradingBotState: TradingBotHook;
  tab: string;
  setTab: (tab: string) => void;
}

export function TradingBotContent({
  tradingBotState,
  tab,
  setTab
}: TradingBotContentProps) {
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
    tokens
  } = tradingBotState;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="md:col-span-2">
        <CardHeader>
          <TabHeader botStatus={botStatus} />
          <CardDescription>
            Αυτοματοποιημένο trading με stop-loss και take-profit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabNavigation tab={tab} onTabChange={setTab} />
            
            <TabsContent value="settings">
              <ConfigurationPanel
                config={config}
                updateConfig={updateConfig}
                selectToken={selectToken}
                selectedTokenPrice={selectedTokenPrice}
                selectedTokenDetails={selectedTokenDetails}
                tokens={tokens}
                isLoading={isLoading}
                botStatus={botStatus}
                startBot={startBot}
                stopBot={stopBot}
              />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrdersTab activeOrders={activeOrders as Order[]} />
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
  );
}
