
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionFooter } from "../wallet/transaction/TransactionFooter";
import { TransactionList } from "../wallet/transaction/TransactionList";

interface TransactionsCardProps {
  walletAddress: string | null;
  displayAddress: string;
}

export function TransactionsCard({ walletAddress, displayAddress }: TransactionsCardProps) {
  const {
    transactions,
    loading,
    refreshTransactions
  } = useTransactions({ 
    walletAddress,
    limit: 5
  });

  // Helper function for badge styling
  const getStatusBadgeClass = (status: string) => {
    return status.toLowerCase() === 'success' || status.toLowerCase() === 'completed'
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  // Helper function for transaction type icons
  const getTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('send') || lowerType.includes('αποστολ')) return '↑';
    if (lowerType.includes('receive') || lowerType.includes('λήψ')) return '↓';
    if (lowerType.includes('swap') || lowerType.includes('ανταλλαγ')) return '↔';
    return '•';
  };

  if (!walletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Πρόσφατες Συναλλαγές</CardTitle>
          <CardDescription>Συνδεθείτε για να δείτε τις συναλλαγές σας</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p>Δεν έχετε συνδέσει πορτοφόλι</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Πρόσφατες Συναλλαγές</CardTitle>
        <CardDescription>
          Οι τελευταίες συναλλαγές για το πορτοφόλι {displayAddress}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionList 
          transactions={transactions}
          isLoading={loading}
          walletAddress={walletAddress}
          limit={5}
          getStatusBadgeClass={getStatusBadgeClass}
          getTypeIcon={getTypeIcon}
        />
        
        <TransactionFooter 
          walletAddress={walletAddress} 
          showViewAll={true} 
          transactions={transactions} 
        />
      </CardContent>
    </Card>
  );
}
