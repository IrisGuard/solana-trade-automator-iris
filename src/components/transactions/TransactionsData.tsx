
import React from "react";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { TransactionsList } from "./TransactionsList";
import { TransactionFilterType } from "@/types/transaction-types";
import { getUniqueTokens, formatDate } from "@/utils/transactionUtils";
import { adaptTransactionsDataToTypes } from "@/utils/transactionAdapter";

interface TransactionsDataProps {
  walletAddress: string;
  filterType: TransactionFilterType;
  isRefreshing: boolean;
}

export function TransactionsData({ walletAddress, filterType, isRefreshing }: TransactionsDataProps) {
  const { transactions, isLoading } = useTransactionsData(walletAddress);
  
  // Adapt transactions to the expected type
  const adaptedTransactions = adaptTransactionsDataToTypes(transactions);
  
  return (
    <TransactionsList 
      transactions={adaptedTransactions} 
      filterType={filterType} 
      isLoading={isLoading}
      isRefreshing={isRefreshing}
    />
  );
}

// Re-export the functions and types for backward compatibility
export { getUniqueTokens, formatDate };
export type { TransactionFilterType };
