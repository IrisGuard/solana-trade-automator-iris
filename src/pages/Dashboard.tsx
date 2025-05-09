
import React from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletTokensList } from "@/components/wallet/WalletTokensList";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const Dashboard = () => {
  const { isConnected, walletAddress, tokens, connectWallet } = useWalletConnection();

  return (
    <div className="container mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      {isConnected ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <WalletTokensList tokens={tokens} />
            
            <Card>
              <CardHeader>
                <CardTitle>Bot Status</CardTitle>
                <CardDescription>Automated trading bot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-4 text-center text-muted-foreground">
                  <p>Your bot is currently inactive</p>
                  <Button className="mt-4">Configure Bot</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <TransactionHistory walletAddress={walletAddress} />
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect to see your dashboard</CardDescription>
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

export default Dashboard;
