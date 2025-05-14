
import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import { RefreshCw } from "lucide-react";
import { TransactionList } from "./transaction/TransactionList";
import { TransactionFooter } from "./transaction/TransactionFooter";

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
  const { transactions, loading: isLoadingTransactions, refreshTransactions } = useTransactions({ 
    walletAddress, 
    limit 
  });

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
        <TransactionList
          transactions={transactions}
          isLoading={isLoadingTransactions}
          walletAddress={walletAddress}
          limit={limit}
          getStatusBadgeClass={getStatusBadgeClass}
          getTypeIcon={getTypeIcon}
        />
      </CardContent>
      {walletAddress && showViewAll && transactions.length > 0 && (
        <CardFooter>
          <TransactionFooter 
            walletAddress={walletAddress} 
            showViewAll={showViewAll} 
            transactions={transactions} 
          />
        </CardFooter>
      )}
    </Card>
  );
}
