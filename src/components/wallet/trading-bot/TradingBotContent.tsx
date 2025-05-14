
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SettingsTab } from "./SettingsTab";
import { StrategyTab } from "./StrategyTab";
import { MonitorTab } from "./MonitorTab";
import { Button } from "@/components/ui/button";
import { TradingBotHook } from "@/hooks/trading-bot/types";

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
    selectToken,
    startBot,
    stopBot,
    botStatus,
    isLoading,
    tokens,
    selectedTokenPrice,
    selectedTokenDetails,
    activeOrders
  } = tradingBotState;
  
  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Trading Bot</CardTitle>
        <CardDescription>
          Αυτοματοποιημένο σύστημα συναλλαγών με βάση τη στρατηγική σας
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!tokens || tokens.length === 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Δεν βρέθηκαν tokens στο πορτοφόλι σας. Για να χρησιμοποιήσετε το trading bot,
              πρέπει να έχετε tokens στο πορτοφόλι σας.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="settings">Ρυθμίσεις</TabsTrigger>
              <TabsTrigger value="strategy">Στρατηγική</TabsTrigger>
              <TabsTrigger value="monitor">Παρακολούθηση</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings">
              <div className="space-y-6">
                <SettingsTab
                  config={config}
                  updateConfig={updateConfig}
                  selectToken={selectToken}
                  selectedTokenPrice={selectedTokenPrice}
                  selectedTokenDetails={selectedTokenDetails}
                  tokens={tokens}
                />
                
                {config.selectedToken && (
                  <div className="flex items-center justify-end gap-4 pt-4">
                    {botStatus === 'running' ? (
                      <Button variant="destructive" onClick={stopBot} disabled={isLoading}>
                        Διακοπή Bot
                      </Button>
                    ) : (
                      <Button onClick={startBot} disabled={isLoading || !config.selectedToken}>
                        Έναρξη Bot
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="strategy">
              <StrategyTab
                config={config}
                updateConfig={updateConfig}
              />
            </TabsContent>
            
            <TabsContent value="monitor">
              <MonitorTab
                botStatus={botStatus}
                selectedTokenDetails={selectedTokenDetails}
                selectedTokenPrice={selectedTokenPrice}
                activeOrders={activeOrders}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
