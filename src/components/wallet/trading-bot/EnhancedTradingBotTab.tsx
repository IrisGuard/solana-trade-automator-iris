
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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

  // Convert botStatus to the expected type for EnhancedPanel
  const normalizedBotStatus = botStatus === 'error' ? 'idle' : botStatus;

  // Convert config.enabledStrategies to match expected format for panel
  const adaptedConfig = {
    ...config,
    // Convert string array to object with boolean flags
    enabledStrategies: Array.isArray(config.enabledStrategies) ? 
      {
        dca: config.enabledStrategies.includes('dca'),
        grid: config.enabledStrategies.includes('grid'),
        momentum: config.enabledStrategies.includes('momentum')
      } : config.enabledStrategies
  };

  // Create an adapter for updateConfig to handle the type difference
  const handleConfigUpdate = (newConfig: any) => {
    // If enabledStrategies is an object, convert it back to an array
    if (newConfig.enabledStrategies && typeof newConfig.enabledStrategies === 'object') {
      const enabledStrategiesArray = Object.entries(newConfig.enabledStrategies)
        .filter(([_, enabled]) => enabled)
        .map(([strategy]) => strategy);
      
      updateConfig({
        ...newConfig,
        enabledStrategies: enabledStrategiesArray
      });
    } else {
      updateConfig(newConfig);
    }
  };

  return (
    <Tabs defaultValue="trading">
      <TabsContent value="trading">
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
                <EnhancedPanel
                  config={adaptedConfig}
                  updateConfig={handleConfigUpdate}
                  selectToken={selectToken}
                  selectedTokenPrice={selectedTokenPrice}
                  selectedTokenDetails={selectedTokenDetails}
                  tokens={tokens}
                  isLoading={isLoading}
                  botStatus={normalizedBotStatus}
                  startBot={startBot}
                  stopBot={stopBot}
                />
              </div>
              
              <EnhancedStatusPanel 
                botStatus={normalizedBotStatus}
                selectedTokenDetails={selectedTokenDetails}
                selectedTokenPrice={selectedTokenPrice}
                activeOrders={activeOrders}
              />
            </div>
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
