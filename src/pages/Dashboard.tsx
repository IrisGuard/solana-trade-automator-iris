
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, Wallet, LineChart, ArrowUpRight } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletTokensList } from "@/components/wallet/WalletTokensList";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { isConnected, walletAddress, solBalance, tokens, isLoadingTokens } = useWalletConnection();

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/wallet">
              <Wallet className="h-4 w-4 mr-2" />
              Πορτοφόλι
            </Link>
          </Button>
          <Button asChild>
            <Link to="/transactions">
              <LineChart className="h-4 w-4 mr-2" />
              Συναλλαγές
            </Link>
          </Button>
        </div>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Συνδεθείτε με το πορτοφόλι σας</CardTitle>
            <CardDescription>
              Για να δείτε τα στοιχεία του dashboard, παρακαλώ συνδεθείτε με το πορτοφόλι σας.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Υπόλοιπο SOL</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{solBalance} SOL</div>
                <p className="text-xs text-muted-foreground">
                  Πορτοφόλι: {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : ""}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tokens</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tokens?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Διαφορετικά tokens στο πορτοφόλι
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ανενεργό</div>
                <Button variant="link" className="p-0 h-auto text-xs text-primary" asChild>
                  <Link to="/bots" className="flex items-center">
                    Ρύθμιση Bot <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Tokens</CardTitle>
                <CardDescription>Τα tokens που έχετε στο πορτοφόλι σας</CardDescription>
              </CardHeader>
              <CardContent>
                <WalletTokensList tokens={tokens} isLoading={isLoadingTokens} />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Πρόσφατες Συναλλαγές</CardTitle>
                <CardDescription>Οι τελευταίες συναλλαγές στο πορτοφόλι σας</CardDescription>
              </CardHeader>
              <CardContent>
                {walletAddress ? (
                  <TransactionHistory walletAddress={walletAddress} limit={5} />
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    Συνδεθείτε με το πορτοφόλι σας για να δείτε τις συναλλαγές
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
