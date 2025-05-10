
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";

interface TransactionHistoryProps {
  walletAddress: string;
}

export function TransactionHistory({ walletAddress }: TransactionHistoryProps) {
  const { transactions, isLoadingTransactions } = useTransactions(walletAddress);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest activity on your wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingTransactions ? (
          <div className="py-6 text-center text-muted-foreground">
            <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length > 0 ? (
          <>
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{tx.type}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(tx.blockTime)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${tx.amount?.startsWith('+') ? 'text-green-500' : ''}`}>{tx.amount || '-'}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => window.open(`https://solscan.io/account/${walletAddress}?cluster=mainnet`, '_blank')}
            >
              View All Transactions <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>No transactions found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
