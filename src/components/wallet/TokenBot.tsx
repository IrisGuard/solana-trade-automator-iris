
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Token } from "@/types/wallet";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";
import { formatTokenAmount } from "@/utils/tokenUtils";

interface TokenBotProps {
  tokens: Token[];
  isConnected: boolean;
  onConnectWallet: () => Promise<void>;
}

export function TokenBot({ tokens = [], isConnected, onConnectWallet }: TokenBotProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Function to ensure we can actually access the token properties
  const getFirstTokenAmount = (): string => {
    if (tokens.length > 0 && tokens[0]) {
      return formatTokenAmount(tokens[0]);
    }
    return "0";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Bot</CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <ConnectPrompt handleConnectWallet={onConnectWallet} />
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-md">
                  <h3 className="mb-2 font-medium">Bot Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Inactive</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="mb-2 font-medium">Available Tokens</h3>
                  <p className="text-sm">{tokens.length > 0 ? `${tokens.length} tokens available` : 'No tokens found'}</p>
                  {tokens.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-muted-foreground">First token amount: </span>
                      <span className="font-mono">{getFirstTokenAmount()}</span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="p-4 border rounded-md">
                <h3 className="mb-2 font-medium">Bot Settings</h3>
                <p className="text-sm text-muted-foreground">Bot settings will be available soon.</p>
              </div>
            </TabsContent>
            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="p-4 border rounded-md">
                <h3 className="mb-2 font-medium">Trading History</h3>
                <p className="text-sm text-muted-foreground">No trading history available.</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
