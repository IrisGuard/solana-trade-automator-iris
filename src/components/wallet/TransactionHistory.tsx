
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Wallet as WalletIcon } from "lucide-react";
import { TransactionsData } from "@/components/transactions/TransactionsData";
import { TokenActivity } from "@/components/transactions/TokenActivity";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface TransactionHistoryProps {
  walletAddress?: string | null;
}

export function TransactionHistory({ walletAddress }: TransactionHistoryProps) {
  const { refreshWalletData } = useWalletConnection();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshWalletData();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  if (!walletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ιστορικό Συναλλαγών</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <WalletIcon className="h-10 w-10 opacity-50" />
              <p>Συνδέστε το wallet σας για να δείτε το ιστορικό συναλλαγών</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0">
        <CardTitle className="flex-1">Ιστορικό Συναλλαγών</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0" 
          disabled={isRefreshing} 
          onClick={handleRefresh}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="sr-only">Ανανέωση</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Όλες</TabsTrigger>
            <TabsTrigger value="sent">Αποστολές</TabsTrigger>
            <TabsTrigger value="received">Λήψεις</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <TransactionsData 
              walletAddress={walletAddress} 
              filterType="all" 
              isRefreshing={isRefreshing} 
            />
          </TabsContent>
          <TabsContent value="sent">
            <TransactionsData 
              walletAddress={walletAddress} 
              filterType="sent" 
              isRefreshing={isRefreshing} 
            />
          </TabsContent>
          <TabsContent value="received">
            <TransactionsData 
              walletAddress={walletAddress} 
              filterType="received" 
              isRefreshing={isRefreshing} 
            />
          </TabsContent>
          <TabsContent value="tokens">
            <TokenActivity 
              walletAddress={walletAddress} 
              isRefreshing={isRefreshing} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
