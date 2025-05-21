
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JupiterSwapForm } from "./swap/JupiterSwapForm";
import { RaydiumSwapForm } from "./swap/RaydiumSwapForm";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export interface SwapTabProps {
  isConnected?: boolean;
}

export function SwapTab({ isConnected: _isConnected }: SwapTabProps) {
  const { isConnected, connectWallet } = useWalletConnection();
  const actuallyConnected = _isConnected !== undefined ? _isConnected : isConnected;
  
  const [swapProvider, setSwapProvider] = useState<"jupiter" | "raydium">("jupiter");
  
  const handleConnectWallet = () => {
    if (connectWallet) {
      connectWallet();
    }
  };
  
  if (!actuallyConnected) {
    return (
      <TabsContent value="swap" className="space-y-4">
        <ConnectPrompt 
          handleConnectWallet={handleConnectWallet} 
          size="large"
        />
      </TabsContent>
    );
  }
  
  return (
    <TabsContent value="swap" className="space-y-4">
      <Card className="border-none bg-transparent shadow-none">
        <div className="mb-4">
          <Tabs 
            defaultValue="jupiter" 
            value={swapProvider} 
            onValueChange={(value) => setSwapProvider(value as "jupiter" | "raydium")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jupiter">Jupiter</TabsTrigger>
              <TabsTrigger value="raydium">Raydium</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {swapProvider === "jupiter" ? <JupiterSwapForm /> : <RaydiumSwapForm />}
      </Card>
    </TabsContent>
  );
}
