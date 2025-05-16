
import React from "react";
import { Transaction } from "@/types/transaction-types";
import { formatDate } from "@/utils/transactionUtils";

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isSent = transaction.type.includes('sent') || transaction.type.includes('out');
  
  return (
    <div 
      key={transaction.id} 
      className="flex items-center justify-between p-3 border rounded-lg"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isSent ? 'bg-red-100' : 'bg-green-100'}`}>
          <span className={isSent ? 'text-red-500' : 'text-green-500'}>
            {isSent ? '↑' : '↓'}
          </span>
        </div>
        <div>
          <div className="font-medium">{transaction.token}</div>
          <div className="text-sm text-muted-foreground">{formatDate(transaction.timestamp)}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">{transaction.amount}</div>
        <div className="text-sm text-muted-foreground">{transaction.status}</div>
      </div>
    </div>
  );
};
