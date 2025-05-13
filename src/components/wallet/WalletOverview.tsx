
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";

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
            <CardDescription>Κατάσταση Πορτοφολιού</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {isConnected ? "Συνδεδεμένο" : "Μη Συνδεδεμένο"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConnected && (
              <div className="text-sm text-muted-foreground">
                <p>Διεύθυνση: {walletAddress}</p>
                <p>Υπόλοιπο: {solBalance} SOL</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Κατάσταση Maker Bot</CardDescription>
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
            <CardDescription>Κατάσταση API</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {/* API status information */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Συνδεδεμένο με Solana Mainnet</p>
              <p>Τελευταίος συγχρονισμός: 1 λεπτό πριν</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code Πορτοφολιού</CardTitle>
            <CardDescription>Σαρώστε για να στείλετε SOL ή tokens</CardDescription>
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
