
import React from "react";
import { Transaction } from "@/types/transaction";
import { useLanguage } from "@/hooks/use-language";
import { Badge } from "@/components/ui/badge";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  walletAddress: string | null;
  limit?: number;
  getStatusBadgeClass: (status: string) => string;
  getTypeIcon: (type: string) => string;
}

export function TransactionList({ 
  transactions, 
  isLoading, 
  walletAddress, 
  limit = 5,
  getStatusBadgeClass,
  getTypeIcon
}: TransactionListProps) {
  const { t } = useLanguage();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(limit).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border border-gray-800 rounded-lg bg-gray-900/50 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-800"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-800 rounded"></div>
                <div className="h-3 w-16 bg-gray-800 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-800 rounded"></div>
              <div className="h-3 w-12 bg-gray-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Show empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed border-gray-700 rounded-lg bg-gray-900/50">
        <p className="text-gray-400">
          {walletAddress 
            ? t("transactions.noTransactionsFound", "Δεν βρέθηκαν συναλλαγές") 
            : t("transactions.connectWalletToSeeTransactions", "Συνδέστε το wallet σας για να δείτε τις συναλλαγές σας")}
        </p>
      </div>
    );
  }
  
  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    
    if (diffDay > 0) {
      return `${diffDay} ${diffDay === 1 ? 'ημέρα' : 'ημέρες'} πριν`;
    } else if (diffHr > 0) {
      return `${diffHr} ${diffHr === 1 ? 'ώρα' : 'ώρες'} πριν`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'λεπτό' : 'λεπτά'} πριν`;
    } else {
      return 'μόλις τώρα';
    }
  };
  
  return (
    <div className="space-y-2">
      {transactions.slice(0, limit).map((tx, index) => (
        <div key={index} className="flex items-center justify-between p-3 border border-gray-800 rounded-lg hover:bg-gray-900/70 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center text-lg">
              {getTypeIcon(tx.type)}
            </div>
            <div>
              <div className="font-medium">
                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1).toLowerCase()}
              </div>
              <div className="text-sm text-gray-400">
                {formatDate(tx.timestamp || tx.blockTime * 1000)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {typeof tx.amount === 'number' ? tx.amount.toFixed(4) : tx.amount}
            </div>
            <Badge className={getStatusBadgeClass(tx.status)}>
              {tx.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
