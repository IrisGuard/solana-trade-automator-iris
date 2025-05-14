
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { useTradingBot } from "@/hooks/useTradingBot";
import { useWallet } from '@/hooks/useWallet';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BotControlPanel } from "./BotControlPanel";
import { BotStatusPanel } from "./BotStatusPanel";

export function TradingBotTab() {
  const { isConnected } = useWallet();
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
  } = useTradingBot();

  return (
    <TabsContent value="trading-bot">
      {!isConnected ? (
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
              <BotControlPanel
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
            </div>
            
            <BotStatusPanel 
              botStatus={botStatus}
              selectedTokenDetails={selectedTokenDetails}
              selectedTokenPrice={selectedTokenPrice}
              activeOrders={activeOrders}
            />
          </div>
        </>
      )}
    </TabsContent>
  );
}
