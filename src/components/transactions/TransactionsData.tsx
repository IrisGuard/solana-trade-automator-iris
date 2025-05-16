
import React from "react";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { TransactionsList } from "./TransactionsList";
import { TransactionFilterType } from "@/types/transaction-types";
import { getUniqueTokens, formatDate } from "@/utils/transactionUtils";

interface TransactionsDataProps {
  walletAddress: string;
  filterType: TransactionFilterType;
  isRefreshing: boolean;
}

export function TransactionsData({ walletAddress, filterType, isRefreshing }: TransactionsDataProps) {
  const { transactions, isLoading } = useTransactionsData(walletAddress);
  
  return (
    <TransactionsList 
      transactions={transactions} 
      filterType={filterType} 
      isLoading={isLoading}
      isRefreshing={isRefreshing}
    />
  );
}

// Re-export the functions and types for backward compatibility
export { getUniqueTokens, formatDate };
export type { TransactionFilterType };
