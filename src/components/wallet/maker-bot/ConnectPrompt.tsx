
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConnectPromptProps {
  handleConnectWallet: () => void;
}

export function ConnectPrompt({ handleConnectWallet }: ConnectPromptProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Connect Wallet to Use Maker Bot</CardTitle>
        <CardDescription>You need to connect your wallet to use the trading bot</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <Button onClick={handleConnectWallet}>Connect Wallet</Button>
      </CardContent>
    </Card>
  );
}
