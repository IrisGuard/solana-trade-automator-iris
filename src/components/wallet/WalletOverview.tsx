
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

interface WalletOverviewProps {
  isConnected: boolean;
  walletAddress: string;
  solBalance: number;
  handleConnectWallet: () => void;
  handleDisconnectWallet: () => void;
}

export function WalletOverview({
  isConnected,
  walletAddress,
  solBalance,
  handleConnectWallet,
  handleDisconnectWallet
}: WalletOverviewProps) {
  return (
    <TabsContent value="overview" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Wallet Status</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {isConnected ? "Connected" : "Not Connected"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConnected && (
              <div className="text-sm text-muted-foreground">
                <p>Address: {walletAddress}</p>
                <p>Balance: {solBalance} SOL</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Maker Bot Status</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {/* Using a passed in botActive prop */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {/* Bot status information */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>API Status</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {/* API status information */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Connected to Solana Mainnet</p>
              <p>Last sync: 1 min ago</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet QR Code</CardTitle>
            <CardDescription>Scan to send SOL or tokens</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="border border-border p-4 rounded-lg">
              <QrCode size={200} />
            </div>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}
