
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/transactionUtils";
import { useTransactions } from "@/hooks/useTransactions";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionsCardProps {
  walletAddress: string;
  displayAddress: string;
}

export function TransactionsCard({ walletAddress, displayAddress }: TransactionsCardProps) {
  const [showAll, setShowAll] = useState(false);
  const { transactions, loading } = useTransactions({ walletAddress });
  
  const displayedTransactions = showAll 
    ? transactions 
    : transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-base font-medium">
          Recent Transactions {displayAddress && `(${displayAddress})`}
        </CardTitle>
        {transactions.length > 5 && (
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
          >
            {showAll ? "Show less" : "Show all"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : displayedTransactions.length > 0 ? (
          <div className="space-y-4">
            {displayedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-6 w-14 flex justify-center",
                      transaction.type === "buy"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    )}
                  >
                    {transaction.type === "buy" ? "Buy" : "Sell"}
                  </Badge>
                  <div>
                    <div className="font-medium">
                      {transaction.amount} {transaction.token}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(transaction.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{transaction.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {transaction.bot}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-8 text-muted-foreground">
            No transactions found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
