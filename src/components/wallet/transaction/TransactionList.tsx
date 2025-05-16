
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";
import type { Transaction } from "@/types/transaction";

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
      <div className="space-y-3 mb-6">
        {Array.from({ length: limit }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground mb-6">
        <p>Δεν βρέθηκαν συναλλαγές</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 mb-6">
      {transactions.map((tx, i) => (
        <div
          key={tx.signature || i}
          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-bold">{getTypeIcon(tx.type)}</span>
            </div>
            
            <div>
              <div className="font-medium">{tx.type}</div>
              <div className="text-xs text-muted-foreground">
                {tx.timestamp
                  ? formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true, locale: el })
                  : "Άγνωστη ημερομηνία"}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="font-medium">
              {tx.amount ? `${Number(tx.amount).toFixed(4)} ${tx.token || 'SOL'}` : ""}
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(tx.status)}`}>
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
