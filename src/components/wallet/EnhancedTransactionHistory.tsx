
import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import { ExternalLink, Loader, RefreshCw } from "lucide-react";
import { formatWalletAddress } from "@/utils/walletUtils";

interface EnhancedTransactionHistoryProps {
  walletAddress: string | null;
  limit?: number;
  showViewAll?: boolean;
  showTitle?: boolean;
}

export function EnhancedTransactionHistory({
  walletAddress,
  limit = 10,
  showViewAll = true,
  showTitle = true
}: EnhancedTransactionHistoryProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { transactions, isLoadingTransactions, refreshTransactions } = useTransactions(walletAddress || "");

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleRefresh = useCallback(async () => {
    if (!walletAddress) return;
    
    setIsRefreshing(true);
    await refreshTransactions();
    setIsRefreshing(false);
  }, [walletAddress, refreshTransactions]);

  const getStatusBadgeClass = (status: string) => {
    return status === 'Success' 
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Send')) return '↑';
    if (type.includes('Receive')) return '↓';
    if (type.includes('Swap')) return '↔';
    return '•';
  };

  return (
    <Card>
      {showTitle && (
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Πρόσφατες Συναλλαγές</CardTitle>
            <CardDescription>
              {walletAddress
                ? `Οι τελευταίες ${limit} συναλλαγές σας`
                : "Συνδεθείτε για να δείτε το ιστορικό συναλλαγών σας"}
            </CardDescription>
          </div>
          {walletAddress && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoadingTransactions}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          )}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {isLoadingTransactions ? (
          <div className="py-6 text-center text-muted-foreground">
            <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p>Φόρτωση συναλλαγών...</p>
          </div>
        ) : !walletAddress ? (
          <div className="py-6 text-center text-muted-foreground">
            <p>Δεν έχετε συνδέσει πορτοφόλι</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.slice(0, limit).map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${tx.type.includes('Send') ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                      tx.type.includes('Receive') ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    {getTypeIcon(tx.type)}
                  </span>
                  <div>
                    <p className="font-medium">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.from && tx.to ? (
                        <>
                          {tx.type.includes('Send') ? 'Προς:' : 'Από:'}{' '}
                          {tx.type.includes('Send') 
                            ? formatWalletAddress(tx.to) 
                            : formatWalletAddress(tx.from)}
                        </>
                      ) : formatDate(tx.blockTime)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${tx.amount?.startsWith('+') ? 'text-green-600 dark:text-green-400' : 
                    tx.amount?.startsWith('-') ? 'text-red-600 dark:text-red-400' : ''}`}>
                    {tx.amount || '-'}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusBadgeClass(tx.status)}`}>
                      {tx.status}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>Δεν βρέθηκαν συναλλαγές</p>
          </div>
        )}
      </CardContent>
      {walletAddress && showViewAll && transactions.length > 0 && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.open(`https://solscan.io/account/${walletAddress}?cluster=mainnet`, '_blank')}
          >
            Προβολή Όλων των Συναλλαγών <ExternalLink className="ml-2 h-3 w-3" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
