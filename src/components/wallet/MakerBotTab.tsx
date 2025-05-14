
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";

interface MakerBotTabProps {
  isConnected: boolean;
}

export function MakerBotTab({ isConnected }: MakerBotTabProps) {
  const handleConnectWallet = () => {
    // This would be handled by the WalletMultiButton component
  };
  
  if (!isConnected) {
    return (
      <TabsContent value="maker-bot" className="space-y-4">
        <ConnectPrompt 
          handleConnectWallet={handleConnectWallet} 
          size="large"
        />
      </TabsContent>
    );
  }
  
  return (
    <TabsContent value="maker-bot" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Maker Bot</CardTitle>
          <CardDescription>
            Παροχή ρευστότητας και εκτέλεση εντολών για άλλους συναλλασσόμενους
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Το Maker Bot είναι υπό κατασκευή.</p>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
