import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedTransactionFilters } from "@/components/transactions/EnhancedTransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionPagination } from "@/components/transactions/Pagination";
import { TransactionSummary } from "@/components/transactions/TransactionSummary";
import { TokenActivity } from "@/components/transactions/TokenActivity";
import { useTransactions, getUniqueTokens, formatDate } from "@/components/transactions/TransactionsData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function TransactionsEnhanced() {
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tokenFilter, setTokenFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  
  // Get transactions data using the hook
  const { transactions = [] } = useTransactions();

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
      const txDate = new Date(tx.timestamp);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      withinDateRange = withinDateRange && txDate >= start;
    }
    if (endDate) {
      const txDate = new Date(tx.timestamp);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Προηγμένες Συναλλαγές</h2>
          <p className="text-muted-foreground">
            Αναλύστε τις συναλλαγές σας με προηγμένα φίλτρα και εργαλεία οπτικοποίησης
          </p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Αυτή η σελίδα παρέχει προηγμένες λειτουργίες φιλτραρίσματος και ανάλυσης συναλλαγών.
          Χρησιμοποιήστε τα φίλτρα για να περιορίσετε τα αποτελέσματα και τα γραφήματα για ανάλυση.
        </AlertDescription>
      </Alert>

      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Ιστορικό Συναλλαγών</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Χρησιμοποιήστε τα φίλτρα για να εντοπίσετε συγκεκριμένες συναλλαγές βάσει κριτηρίων. Μπορείτε να φιλτράρετε κατά τύπο, token και χρονικό διάστημα.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>Προβολή και ανάλυση όλων των συναλλαγών σας</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>Οδηγίες Χρήσης Προηγμένων Φίλτρων</CardTitle>
          <CardDescription>
            Μάθετε πώς να αξιοποιήσετε στο μέγιστο τα εργαλεία ανάλυσης συναλλαγών
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card border rounded-md p-4">
              <h3 className="font-medium mb-2">Αναζήτηση</h3>
              <p className="text-sm text-muted-foreground">
                Πληκτρολογήστε για να αναζητήσετε ID συναλλαγών, ονόματα token ή bots που εκτέλεσαν τις συναλλαγές.
              </p>
            </div>
            <div className="bg-card border rounded-md p-4">
              <h3 className="font-medium mb-2">Φίλτρα Τύπου</h3>
              <p className="text-sm text-muted-foreground">
                Επιλέξτε τύπο συναλλαγής για να προβάλετε μόνο αγορές, πωλήσεις ή άλλες κατηγορίες συναλλαγών.
              </p>
            </div>
            <div className="bg-card border rounded-md p-4">
              <h3 className="font-medium mb-2">Φίλτρα Ημερομηνίας</h3>
              <p className="text-sm text-muted-foreground">
                Ορίστε χρονικό διάστημα για να δείτε συναλλαγές που πραγματοποιήθηκαν μόνο σε συγκεκριμένη περίοδο.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
