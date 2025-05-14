
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { useTradingBot } from "@/hooks/useTradingBot";
import { useWallet } from "@solana/wallet-adapter-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { EnhancedPanel } from "./EnhancedPanel";
import { EnhancedStatusPanel } from "./EnhancedStatusPanel";

export function EnhancedTradingBotTab() {
  const { connected } = useWallet();
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

  // Convert 'error' status to 'idle' to match the expected types in EnhancedStatusPanel
  const displayBotStatus = botStatus === 'error' ? 'idle' : botStatus;

  return (
    <TabsContent value="trading-bot">
      {!connected ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to use the Trading Bot
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="space-y-4">
              <EnhancedPanel
                config={config}
                updateConfig={updateConfig}
                selectToken={selectToken}
                selectedTokenPrice={selectedTokenPrice}
                selectedTokenDetails={selectedTokenDetails}
                tokens={tokens}
                isLoading={isLoading}
                botStatus={displayBotStatus}
                startBot={startBot}
                stopBot={stopBot}
              />
            </div>
            
            <EnhancedStatusPanel 
              botStatus={displayBotStatus}
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
