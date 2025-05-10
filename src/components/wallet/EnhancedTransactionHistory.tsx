
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Loader, ArrowDown, ArrowUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";
import { Transaction } from "@/types/wallet";
import { Badge } from "@/components/ui/badge";
import { formatWalletAddress } from "@/utils/walletUtils";

interface EnhancedTransactionHistoryProps {
  walletAddress: string;
  limit?: number;
  showViewAll?: boolean;
}

export function EnhancedTransactionHistory({ 
  walletAddress, 
  limit = 5,
  showViewAll = true 
}: EnhancedTransactionHistoryProps) {
  const { transactions, isLoadingTransactions, loadTransactions } = useTransactions(walletAddress);
  const [isExporting, setIsExporting] = useState(false);

  // Format relative time from timestamp
  const getRelativeTime = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true,
        locale: el
      });
    } catch (error) {
      return 'Άγνωστη ημερομηνία';
    }
  };
  
  // Get transaction icon based on type
  const getTransactionIcon = (tx: Transaction) => {
    if (tx.type.includes('Receive')) {
      return <ArrowDown className="h-4 w-4 text-green-500" />;
    } else if (tx.type.includes('Send')) {
      return <ArrowUp className="h-4 w-4 text-orange-500" />;
    } else {
      return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get transaction status icon
  const getStatusIcon = (status: string) => {
    if (status === 'Success') {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    } else {
      return <XCircle className="h-3 w-3 text-red-500" />;
    }
  };

  // View transaction on Solana explorer
  const viewOnExplorer = (signature: string) => {
    window.open(`https://solscan.io/tx/${signature}`, '_blank');
  };

  // Export transactions to CSV
  const exportToCSV = async () => {
    try {
      setIsExporting(true);
      
      // Load more transactions for export
      const exportTransactions = transactions.length >= 20 
        ? transactions 
        : await loadTransactions(walletAddress, 20);
      
      // Create CSV content
      const header = ["Ημερομηνία", "Τύπος", "Ποσό", "Κατάσταση", "Από", "Προς", "Signature"];
      
      const rows = exportTransactions.map(tx => [
        new Date(tx.blockTime).toLocaleString(),
        tx.type,
        tx.amount || "-",
        tx.status,
        tx.from || "-",
        tx.to || "-", 
        tx.signature
      ]);
      
      const csvContent = [
        header.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.setAttribute("href", url);
      link.setAttribute("download", `transactions-${formatWalletAddress(walletAddress)}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error exporting transactions:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Filtered transactions based on limit
  const displayedTransactions = transactions.slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Συναλλαγές</CardTitle>
          <CardDescription>Πρόσφατη δραστηριότητα στο πορτοφόλι σας</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToCSV} 
          disabled={isExporting || isLoadingTransactions || transactions.length === 0}
          className="h-8"
        >
          {isExporting ? (
            <>
              <Loader className="mr-2 h-3 w-3 animate-spin" />
              Εξαγωγή...
            </>
          ) : "Εξαγωγή CSV"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingTransactions ? (
          Array(limit).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          ))
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Δεν βρέθηκαν πρόσφατες συναλλαγές</p>
          </div>
        ) : (
          displayedTransactions.map((tx, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/20 transition-colors p-2 rounded-md">
              <div>
                <div className="flex items-center gap-2">
                  {getTransactionIcon(tx)}
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-medium">{tx.type}</p>
                      <Badge variant="outline" className="h-5 px-1 flex items-center gap-1">
                        {getStatusIcon(tx.status)}
                        <span className="text-xs">{tx.status}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getRelativeTime(tx.blockTime)}
                    </p>
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {tx.from && tx.to ? (
                    <span title={`Από: ${tx.from}\nΠρος: ${tx.to}`}>
                      {formatWalletAddress(tx.from)} → {formatWalletAddress(tx.to)}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  <p className={`font-medium ${tx.amount?.startsWith('+') ? 'text-green-500' : tx.amount?.startsWith('-') ? 'text-orange-500' : ''}`}>
                    {tx.amount || '-'}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => viewOnExplorer(tx.signature)}
                    title="Προβολή στο Solscan"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]" title={tx.signature}>
                  {formatWalletAddress(tx.signature)}
                </p>
              </div>
            </div>
          ))
        )}
        
        {showViewAll && transactions.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            asChild
          >
            <a href="/transactions">
              Προβολή όλων των συναλλαγών 
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
