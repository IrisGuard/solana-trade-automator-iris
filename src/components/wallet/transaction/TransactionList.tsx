
import React from "react";
import { Loader } from "lucide-react";
import { Transaction } from "@/types/wallet";
import { TransactionItem } from "./TransactionItem";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  walletAddress: string | null;
  limit: number;
  getStatusBadgeClass: (status: string) => string;
  getTypeIcon: (type: string) => string;
}

export function TransactionList({ 
  transactions, 
  isLoading, 
  walletAddress, 
  limit,
  getStatusBadgeClass,
  getTypeIcon
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p>Φόρτωση συναλλαγών...</p>
      </div>
    );
  }
  
  if (!walletAddress) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        <p>Δεν έχετε συνδέσει πορτοφόλι</p>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        <p>Δεν βρέθηκαν συναλλαγές</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {transactions.slice(0, limit).map((tx, i) => (
        <TransactionItem 
          key={i} 
          tx={tx} 
          getStatusBadgeClass={getStatusBadgeClass} 
          getTypeIcon={getTypeIcon} 
        />
      ))}
    </div>
  );
}
