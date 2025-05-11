
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Transaction {
  id: string;
  type: string;
  token: string;
  amount: string;
  price: string;
  value: string;
  timestamp: string;
  status: string;
  bot: string;
}

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export function TransactionSummary({ transactions }: TransactionSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Summary</CardTitle>
        <CardDescription>Overview of your trading activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">{transactions.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Last 30 days
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Trading Volume</p>
            <p className="text-2xl font-bold">$1,246.50</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Last 30 days
            </p>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <p className="mb-2 font-medium">Transaction Breakdown</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Buy Transactions</span>
                <span className="font-medium">{transactions.filter(tx => tx.type === "buy").length}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-green-400"
                  style={{
                    width: `${(transactions.filter(tx => tx.type === "buy").length / transactions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sell Transactions</span>
                <span className="font-medium">{transactions.filter(tx => tx.type === "sell").length}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-red-400"
                  style={{
                    width: `${(transactions.filter(tx => tx.type === "sell").length / transactions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
