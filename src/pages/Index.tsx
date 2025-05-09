
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Wallet, ExternalLink } from "lucide-react";
import { WalletTokensList } from "@/components/wallet/WalletTokensList";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const Index = () => {
  const {
    isConnected,
    walletAddress,
    solBalance,
    tokens,
    connectWallet,
    disconnectWallet,
  } = useWalletConnection();

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Home Page</h2>
        {isConnected ? (
          <Button variant="outline" onClick={disconnectWallet} className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={connectWallet} className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Connect with Phantom Wallet
          </Button>
        )}
      </div>

      {isConnected ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
              <CardDescription>Information about your connected wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Address:</span>
                  <span className="font-mono text-sm">{walletAddress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Balance:</span>
                  <span className="text-sm">{solBalance} SOL</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Solscan
                </Button>
              </div>
            </CardContent>
          </Card>

          <WalletTokensList tokens={tokens} />

          <TransactionHistory walletAddress={walletAddress} />

          <Card>
            <CardHeader>
              <CardTitle>Maker Bot</CardTitle>
              <CardDescription>Automated trading on Solana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-muted-foreground">
                <p>Bot functionality coming soon</p>
                <p className="text-sm">You'll be able to automate your trades on the Solana blockchain</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardTitle>Connect with Phantom Wallet</CardTitle>
            <CardDescription>Connect to see your tokens and transaction history</CardDescription>
          </CardHeader>
          <CardContent className="py-10 text-center">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <Wallet className="h-10 w-10 text-muted-foreground" />
            </div>
            <Button onClick={connectWallet} className="flex mx-auto items-center gap-2">
              <Wallet className="h-4 w-4" />
              Connect with Phantom Wallet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
