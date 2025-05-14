
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
          <h2 className="text-3xl font-bold tracking-tight">Συναλλαγές</h2>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Συνδεθείτε με το Wallet</CardTitle>
            <CardDescription>
              Συνδεθείτε για να δείτε τις συναλλαγές σας
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button onClick={connectWallet}>Σύνδεση με Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Συναλλαγές</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refreshWalletData()}>Ανανέωση</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Συνολικές Συναλλαγές</CardDescription>
            <CardTitle className="text-2xl font-bold">24</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Τελευταίες 30 ημέρες</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Εισερχόμενες</CardDescription>
            <CardTitle className="text-2xl font-bold">10</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">+2 από προηγούμενο μήνα</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Εξερχόμενες</CardDescription>
            <CardTitle className="text-2xl font-bold">14</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">+5 από προηγούμενο μήνα</Badge>
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
