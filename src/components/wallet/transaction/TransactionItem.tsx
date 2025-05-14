
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { formatWalletAddress } from "@/utils/walletUtils";

interface TransactionItemProps {
  tx: Transaction;
  getStatusBadgeClass: (status: string) => string;
  getTypeIcon: (type: string) => string;
}

export function TransactionItem({ tx, getStatusBadgeClass, getTypeIcon }: TransactionItemProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:bg-accent/5 transition-colors">
      <div className="flex items-center gap-3">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center 
          ${tx.type.includes('Send') ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
            tx.type.includes('Receive') ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
          {getTypeIcon(tx.type)}
        </span>
        <div>
          <p className="font-medium">{tx.type}</p>
          <p className="text-xs text-muted-foreground">
            {tx.from && tx.to ? (
              <>
                {tx.type.includes('Send') ? 'Προς:' : 'Από:'}{' '}
                {tx.type.includes('Send') 
                  ? formatWalletAddress(tx.to) 
                  : formatWalletAddress(tx.from)}
              </>
            ) : formatDate(tx.blockTime)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${tx.amount?.toString().startsWith('+') ? 'text-green-600 dark:text-green-400' : 
          tx.amount?.toString().startsWith('-') ? 'text-red-600 dark:text-red-400' : ''}`}>
          {tx.amount || '-'}
        </p>
        <div className="flex items-center justify-end gap-1">
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusBadgeClass(tx.status)}`}>
            {tx.status}
          </span>
          {tx.signature && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
