
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";
import { useTradingBot } from "@/hooks/useTradingBot";
import { TradingBotContent } from "./trading-bot/TradingBotContent";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export function TradingBotTab() {
  const { isConnected } = useWalletConnection();
  const tradingBotState = useTradingBot();
  
  const [tab, setTab] = useState("settings");
  
  // Handle connect wallet
  const handleConnectWallet = () => {
    // This is handled by the WalletMultiButton component
  };
  
  if (!isConnected) {
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
      <TradingBotContent
        tradingBotState={tradingBotState}
        tab={tab}
        setTab={setTab}
      />
    </TabsContent>
  );
}
