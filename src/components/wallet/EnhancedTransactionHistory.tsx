
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionFooter } from "./transaction/TransactionFooter";
import { TransactionList } from "./transaction/TransactionList";
import { Transaction } from "@/types/transaction-types";
import type { Transaction as TransactionListType } from "@/types/transaction";

interface EnhancedTransactionHistoryProps {
  walletAddress: string | null;
  limit?: number;
  showViewAll?: boolean;
}

export function EnhancedTransactionHistory({ 
  walletAddress, 
  limit = 5,
  showViewAll = true 
}: EnhancedTransactionHistoryProps) {
  const {
    transactions,
    loading,
    refreshTransactions
  } = useTransactions({ 
    walletAddress,
    limit
  });

  // Helper function for badge styling
  const getStatusBadgeClass = (status: string) => {
    return status.toLowerCase().includes('success') || status.toLowerCase().includes('completed')
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : status.toLowerCase().includes('pending')
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  // Helper function for transaction type icons
  const getTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('send') || lowerType.includes('transfer_out')) return '↑';
    if (lowerType.includes('receive') || lowerType.includes('transfer_in')) return '↓';
    if (lowerType.includes('swap')) return '↔';
    return '•';
  };

  // Convert transactions to the format expected by TransactionList and TransactionFooter
  const adaptedTransactions: TransactionListType[] = transactions.map(tx => ({
    signature: tx.signature || tx.id || '',
    type: tx.type,
    status: tx.status,
    amount: tx.amount,
    from: undefined,
    to: undefined,
    // Ensure timestamp is properly converted from string to number
    timestamp: typeof tx.timestamp === 'string' 
      ? new Date(tx.timestamp).getTime() 
      : (tx.timestamp || Date.now()),
    blockTime: typeof tx.timestamp === 'string'
      ? new Date(tx.timestamp).getTime() / 1000
      : Math.floor((tx.timestamp || Date.now()) / 1000),
    tokenAddress: undefined,
    token: tx.token
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Πρόσφατες Συναλλαγές</CardTitle>
          <CardDescription>
            Οι τελευταίες {limit} συναλλαγές σας
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshTransactions}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <TransactionList 
          transactions={adaptedTransactions}
          isLoading={loading}
          walletAddress={walletAddress}
          limit={limit}
          getStatusBadgeClass={getStatusBadgeClass}
          getTypeIcon={getTypeIcon}
        />
        
        <TransactionFooter 
          walletAddress={walletAddress} 
          showViewAll={showViewAll} 
          transactions={adaptedTransactions} 
        />
      </CardContent>
    </Card>
  );
}
