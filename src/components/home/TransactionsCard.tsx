
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Transaction {
  signature: string;
  blockTime: number;
  type: string;
  status: string;
  amount: string;
  from: string;
  to: string;
}

interface TransactionsCardProps {
  walletAddress: string | null;
  displayAddress: string;
}

export function TransactionsCard({ walletAddress, displayAddress }: TransactionsCardProps) {
  const transactions: Transaction[] = [
    { 
      signature: "4ZjPsQuVrLh5U6gFiDMzJHwdKVZhm7GYmAKbpvV4KSH5qhVb9TyQVypF5yQBiZcZwAJTCTUGEobYYgBfynUYdHcf",
      blockTime: Date.now() - 1000 * 60 * 5,
      type: "Μεταφορά",
      status: "επιβεβαιώθηκε",
      amount: "+0.1 SOL",
      from: "3xT...9hN",
      to: displayAddress
    },
    {
      signature: "4PqRdnw9qZpU5gTC9Eqob2hsZXxVnB9GULsmgfJkJVgQZbp7sYMZYJPABAw9LJE6Y9fFQzL1FLSpnEE7zzRNc9X6",
      blockTime: Date.now() - 1000 * 60 * 30,
      type: "Ανταλλαγή",
      status: "επιβεβαιώθηκε",
      amount: "-10 USDC",
      from: displayAddress,
      to: "0.05 SOL"
    },
    {
      signature: "5HvAyNxRJhY6RwtZ4QwzPJ21ZBU9f5P8rdBzx2pMRAQrMZoJWQ8YehJdhxmYw4GPDCYQXoJ6r6f1QphMTkTMLTUV",
      blockTime: Date.now() - 1000 * 60 * 120,
      type: "Μεταφορά",
      status: "επιβεβαιώθηκε",
      amount: "-0.2 SOL",
      from: displayAddress,
      to: "5zT...j2Lm"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Πρόσφατες Συναλλαγές</CardTitle>
        <CardDescription>Πρόσφατη δραστηριότητα στο πορτοφόλι σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                {new Date(tx.blockTime).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-medium ${tx.amount?.startsWith('+') ? 'text-green-500' : ''}`}>{tx.amount}</p>
              <p className="text-xs text-muted-foreground">
                {tx.type === "Ανταλλαγή" ? "Για: " : "Προς: "}{tx.to}
              </p>
            </div>
          </div>
        ))}
        {walletAddress && (
          <Link to="/transactions">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center gap-2"
            >
              Προβολή Όλων των Συναλλαγών 
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
