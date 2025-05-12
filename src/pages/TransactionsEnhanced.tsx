
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedTransactionFilters } from "@/components/transactions/EnhancedTransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionPagination } from "@/components/transactions/Pagination";
import { TransactionSummary } from "@/components/transactions/TransactionSummary";
import { TokenActivity } from "@/components/transactions/TokenActivity";
import { transactions, getUniqueTokens, formatDate } from "@/components/transactions/TransactionsData";

export default function TransactionsEnhanced() {
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tokenFilter, setTokenFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Get unique tokens for filter dropdown
  const uniqueTokens = getUniqueTokens(transactions);

  // Filter transactions based on search, type, token, and date range
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tx.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.bot.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    const matchesToken = tokenFilter === "all" || tx.token === tokenFilter;
    
    // Date filtering
    let withinDateRange = true;
    if (startDate) {
      const txDate = new Date(tx.timestamp); // Changed from tx.date to tx.timestamp
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      withinDateRange = withinDateRange && txDate >= start;
    }
    if (endDate) {
      const txDate = new Date(tx.timestamp); // Changed from tx.date to tx.timestamp
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      withinDateRange = withinDateRange && txDate <= end;
    }
    
    return matchesSearch && matchesType && matchesToken && withinDateRange;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, tokenFilter, startDate, endDate]);

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Ιστορικό Συναλλαγών</CardTitle>
              <CardDescription>Προβολή όλων των συναλλαγών σας</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Enhanced Filters component */}
            <EnhancedTransactionFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              tokenFilter={tokenFilter}
              setTokenFilter={setTokenFilter}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              uniqueTokens={uniqueTokens}
            />

            {/* Transaction Table component */}
            <TransactionTable 
              transactions={currentTransactions}
              formatDate={formatDate}
            />

            {/* Pagination component */}
            <TransactionPagination 
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              indexOfFirstTransaction={indexOfFirstTransaction}
              indexOfLastTransaction={Math.min(indexOfLastTransaction, filteredTransactions.length)}
              totalTransactions={filteredTransactions.length}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Transaction Summary component */}
        <TransactionSummary transactions={filteredTransactions.length > 0 ? filteredTransactions : transactions} />
        
        {/* Token Activity component */}
        <TokenActivity 
          transactions={filteredTransactions.length > 0 ? filteredTransactions : transactions}
          uniqueTokens={uniqueTokens} 
        />
      </div>
    </div>
  );
}
