import React, { useState, useEffect } from "react";
// Update import path for useTransactionsData
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { getUniqueTokens, formatDate } from "@/utils/transactionUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/types/transaction-types";

interface TokenActivityProps {
  walletAddress: string;
  transactions?: Transaction[];
  isRefreshing?: boolean;
}

export function TokenActivity({ walletAddress, transactions, isRefreshing }: TokenActivityProps) {
  const { transactions: fetchedTransactions, isLoading } = useTransactionsData(walletAddress);
  const [uniqueTokens, setUniqueTokens] = useState<string[]>([]);
  const [tokenBalances, setTokenBalances] = useState<{ [token: string]: number }>({});
  
  useEffect(() => {
    // Use fetched transactions if available, otherwise fallback to transactions prop
    const allTransactions = fetchedTransactions || transactions || [];
    
    // Calculate unique tokens
    const tokens = getUniqueTokens(allTransactions);
    setUniqueTokens(tokens);
    
    // Calculate token balances
    const balances: { [token: string]: number } = {};
    allTransactions.forEach(tx => {
      const amount = parseFloat(tx.amount);
      if (isNaN(amount)) return;
      
      if (balances[tx.token]) {
        balances[tx.token] += amount;
      } else {
        balances[tx.token] = amount;
      }
    });
    setTokenBalances(balances);
  }, [transactions, fetchedTransactions, isRefreshing]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Δραστηριότητα Token</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full">
          <div className="p-4">
            {isLoading ? (
              <>
                <Skeleton className="mb-2 h-10 w-full" />
                <Skeleton className="mb-2 h-10 w-full" />
                <Skeleton className="mb-2 h-10 w-full" />
              </>
            ) : uniqueTokens.length > 0 ? (
              uniqueTokens.map((token) => (
                <div key={token} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">{token}</Badge>
                    <div>
                      <div className="text-sm font-medium">{token}</div>
                      <div className="text-xs text-muted-foreground">
                        Τελευταία δραστηριότητα: {formatDate(new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{tokenBalances[token]?.toFixed(2) || '0'}</div>
                    <div className="text-xs text-muted-foreground">
                      {/* Add value calculation logic here if available */}
                      Αξία: N/A
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Δεν βρέθηκαν tokens
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
