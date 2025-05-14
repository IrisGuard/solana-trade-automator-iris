
import React from "react";
import { Loader } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { TransactionItem } from "./TransactionItem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
      <Alert variant="default" className="bg-muted/50">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <AlertDescription className="text-muted-foreground">
          Δεν έχετε συνδέσει πορτοφόλι. Συνδεθείτε για να δείτε τις συναλλαγές σας.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <Alert variant="default" className="bg-muted/50">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <AlertDescription className="text-muted-foreground">
          Δεν βρέθηκαν συναλλαγές για αυτό το πορτοφόλι.
        </AlertDescription>
      </Alert>
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
