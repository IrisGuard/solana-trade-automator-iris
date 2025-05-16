
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionFooter } from "./transaction/TransactionFooter";
import { TransactionList } from "./transaction/TransactionList";
import { Transaction as TransactionType } from "@/types/transaction-types";

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

  // Helper function for badge styling - now using the new badge variant
  const getStatusBadgeClass = (status: string) => {
    return status === 'Success' 
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  // Helper function for transaction type icons
  const getTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('send')) return '↑';
    if (type.toLowerCase().includes('receive')) return '↓';
    if (type.toLowerCase().includes('swap')) return '↔';
    return '•';
  };

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
          transactions={transactions as any}
          isLoading={loading}
          walletAddress={walletAddress}
          limit={limit}
          getStatusBadgeClass={getStatusBadgeClass}
          getTypeIcon={getTypeIcon}
        />
        
        <TransactionFooter 
          walletAddress={walletAddress} 
          showViewAll={showViewAll} 
          transactions={transactions as any} 
        />
      </CardContent>
    </Card>
  );
}
