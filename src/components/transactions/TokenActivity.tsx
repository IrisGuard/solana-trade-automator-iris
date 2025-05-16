
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTransactions, getUniqueTokens } from "./TransactionsData";

export interface TokenActivityProps {
  walletAddress: string;
  isRefreshing: boolean;
}

export function TokenActivity({ walletAddress, isRefreshing }: TokenActivityProps) {
  const { transactions } = useTransactions(walletAddress);
  const uniqueTokens = getUniqueTokens(transactions || []);
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No token activity found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {uniqueTokens.map(token => {
        const tokenTxs = transactions.filter(tx => tx.token === token);
        const buyTxs = tokenTxs.filter(tx => tx.type === "buy" || tx.type.includes("received") || tx.type.includes("in"));
        const sellTxs = tokenTxs.filter(tx => tx.type === "sell" || tx.type.includes("sent") || tx.type.includes("out"));
        
        return (
          <div key={token} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                  {token[0]}
                </div>
                <span className="font-medium">{token}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {tokenTxs.length} transactions
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  Buy ({buyTxs.length})
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  Sell ({sellTxs.length})
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary flex">
                <div
                  className="h-full bg-green-400"
                  style={{
                    width: tokenTxs.length ? `${(buyTxs.length / tokenTxs.length) * 100}%` : '0%',
                  }}
                />
                <div
                  className="h-full bg-red-400"
                  style={{
                    width: tokenTxs.length ? `${(sellTxs.length / tokenTxs.length) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
