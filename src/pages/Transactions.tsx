
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionPagination } from "@/components/transactions/Pagination";
import { TransactionSummary } from "@/components/transactions/TransactionSummary";
import { TokenActivity } from "@/components/transactions/TokenActivity";
import { transactions, getUniqueTokens, formatDate } from "@/components/transactions/TransactionsData";

export default function Transactions() {
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tokenFilter, setTokenFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  // Get unique tokens for filter dropdown
  const uniqueTokens = getUniqueTokens(transactions);

  // Filter transactions based on search, type, and token
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tx.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.bot.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    const matchesToken = tokenFilter === "all" || tx.token === tokenFilter;
    
    return matchesSearch && matchesType && matchesToken;
  });

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
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your trading activities</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters component */}
            <TransactionFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              tokenFilter={tokenFilter}
              setTokenFilter={setTokenFilter}
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
              indexOfLastTransaction={indexOfLastTransaction}
              totalTransactions={filteredTransactions.length}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Transaction Summary component */}
        <TransactionSummary transactions={transactions} />
        
        {/* Token Activity component */}
        <TokenActivity 
          transactions={transactions} 
          uniqueTokens={uniqueTokens} 
        />
      </div>
    </div>
  );
}
