
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface SwapTabProps {
  isConnected: boolean;
}

export function SwapTab({ isConnected }: SwapTabProps) {
  const { connectWallet } = useWalletConnection();

  if (!isConnected) {
    return (
      <ConnectPrompt 
        handleConnectWallet={connectWallet}
        size="large"
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Swap</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Token swap functionality will be available in a future update.
          Connect with Jupiter DEX for token swapping capabilities.
        </p>
      </CardContent>
    </Card>
  );
}
