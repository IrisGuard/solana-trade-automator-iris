
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { EnhancedTransactionHistory } from "@/components/wallet/EnhancedTransactionHistory";
import { Badge } from "@/components/ui/badge";

export default function Transactions() {
  const {
    isConnected,
    walletAddress,
    connectWallet,
    refreshWalletData
  } = useWalletConnection();

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect to view your transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refreshWalletData()}>Refresh</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-2xl font-bold">24</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Last 30 days</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Incoming</CardDescription>
            <CardTitle className="text-2xl font-bold">10</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">+2 from previous month</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outgoing</CardDescription>
            <CardTitle className="text-2xl font-bold">14</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">+5 from previous month</Badge>
          </CardContent>
        </Card>
      </div>

      <EnhancedTransactionHistory
        walletAddress={walletAddress}
        showViewAll={false}
      />
    </div>
  );
}
