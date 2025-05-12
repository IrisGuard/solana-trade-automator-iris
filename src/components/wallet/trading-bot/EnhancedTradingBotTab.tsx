
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { AdvancedStrategiesCard } from "./AdvancedStrategiesCard";
import { PerformanceHistoryCard } from "./PerformanceHistoryCard";
import { useTradingBot } from "@/hooks/useTradingBot";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SettingsTab } from "./SettingsTab";
import { StatusCard } from "./StatusCard";

export function EnhancedTradingBotTab() {
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

  return (
    <TabsContent value="trading-bot">
      {!connected ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Παρακαλώ συνδέστε το πορτοφόλι σας για να χρησιμοποιήσετε το Trading Bot
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="space-y-4">
              <SettingsTab
                config={config}
                updateConfig={updateConfig}
                selectToken={selectToken}
                selectedTokenPrice={selectedTokenPrice}
                selectedTokenDetails={selectedTokenDetails}
                tokens={tokens}
              />
              
              {config.selectedToken && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={startBot}
                    disabled={isLoading || botStatus === 'running' || !config.selectedToken}
                  >
                    Εκκίνηση Bot
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={stopBot}
                    disabled={isLoading || botStatus !== 'running'}
                  >
                    Διακοπή Bot
                  </Button>
                </div>
              )}
            </div>
            
            <StatusCard
              botStatus={botStatus}
              selectedTokenDetails={selectedTokenDetails}
              selectedTokenPrice={selectedTokenPrice}
              activeOrders={activeOrders}
            />
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-6">
            <AdvancedStrategiesCard isActive={botStatus !== 'idle'} />
            <PerformanceHistoryCard />
          </div>
        </>
      )}
    </TabsContent>
  );
}
