
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTradingBot } from "@/hooks/useTradingBot";
import { useWallet } from "@solana/wallet-adapter-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { EnhancedPanel } from "./EnhancedPanel";
import { EnhancedStatusPanel } from "./EnhancedStatusPanel";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { TradingBotConfig as LocalTradingBotConfig } from "@/hooks/trading-bot/types";
import { Token } from "@/types/wallet";

export function EnhancedTradingBotTab() {
  const { connected } = useWallet();
  const { tokens } = useWalletConnection();
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
    selectedTokenDetails
  } = useTradingBot(tokens);

  // Convert botStatus to the expected type for EnhancedPanel
  // We now support 'error' in the botStatus type
  const normalizedBotStatus = botStatus === 'error' ? 'idle' : botStatus;

  // Cast config to the correct type for EnhancedPanel which expects different strategy type
  const typedConfig = {
    ...config,
    strategy: config.strategy as "grid" | "dca" | "momentum" | "simple" | "advanced" | "custom"
  } as LocalTradingBotConfig;

  // Create a new array of tokens with the correct type structure that satisfies the Token type
  // from @/types/wallet where amount is required and must be a number
  const typedTokens = tokens.map(token => {
    // Make sure to convert token.amount to number if it's not already
    const amount = typeof token.amount === 'number' ? token.amount : Number(token.amount || 0);
    
    // Convert to the expected Token type with all required properties
    return {
      address: token.address || '',
      symbol: token.symbol || '',
      name: token.name || '',
      amount: amount,
      decimals: token.decimals || 0,
      mint: token.mint || token.address || '',
      logo: token.logo
    } as Token;
  });

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
                  config={typedConfig}
                  updateConfig={updateConfig}
                  selectToken={async (tokenAddr) => selectToken(tokenAddr || '')}
                  selectedTokenPrice={selectedTokenPrice}
                  selectedTokenDetails={selectedTokenDetails}
                  tokens={typedTokens}
                  isLoading={isLoading}
                  botStatus={normalizedBotStatus}
                  startBot={startBot}
                  stopBot={stopBot}
                />
              </div>
              
              <EnhancedStatusPanel 
                botStatus={normalizedBotStatus}
                selectedTokenDetails={selectedTokenDetails || undefined}
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
