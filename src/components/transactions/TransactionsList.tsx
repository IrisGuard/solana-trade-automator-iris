
import React, { useState, useEffect } from "react";
import { Transaction, TransactionFilterType } from "@/types/transaction-types";
import { TransactionItem } from "./TransactionItem";

interface TransactionsListProps {
  transactions: Transaction[];
  filterType: TransactionFilterType;
  isLoading: boolean;
  isRefreshing?: boolean;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  filterType,
  isLoading,
  isRefreshing = false
}) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    if (!transactions) return;
    
    let filtered = [...transactions];
    
    if (filterType === 'sent') {
      filtered = filtered.filter(tx => tx.type === 'sent' || tx.type === 'transfer_out');
    } else if (filterType === 'received') {
      filtered = filtered.filter(tx => tx.type === 'received' || tx.type === 'transfer_in');
    }
    
    setFilteredTransactions(filtered);
  }, [transactions, filterType, isRefreshing]);
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading transactions...</div>;
  }
  
  if (filteredTransactions.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">No transactions found.</div>;
  }
  
  return (
    <div className="space-y-4">
      {filteredTransactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};
