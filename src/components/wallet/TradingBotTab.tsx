
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";
import { useTradingBot } from "@/hooks/useTradingBot";
import { TradingBotContent } from "./trading-bot/TradingBotContent";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export function TradingBotTab() {
  const { isConnected, walletAddress, connectWallet } = useWalletConnection();
  const tradingBotState = useTradingBot();
  
  const [tab, setTab] = useState("settings");
  
  // Handle connect wallet
  const handleConnectWallet = () => {
    connectWallet();
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
        isConnected={isConnected}
        walletAddress={walletAddress}
        handleConnectWallet={handleConnectWallet}
      />
    </TabsContent>
  );
}
