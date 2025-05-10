import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Transaction } from "@/types/wallet";

interface TransactionHistoryProps {
  walletAddress: string;
}

export function TransactionHistory({ walletAddress }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be a call to Solana API
        // For now, we'll simulate the data with a timeout
        setTimeout(() => {
          setTransactions([
            {
              signature: "4ZjPsQuVrLh5U6gFiDMzJHwdKVZhm7GYmAKbpvV4KSH5qhVb9TyQVypF5yQBiZcZwAJTCTUGEobYYgBfynUYdHcf",
              blockTime: Date.now() - 1000 * 60 * 5,
              type: "Transfer",
              status: "confirmed",
              amount: "+0.1 SOL",
              from: "3xT...9hN",
              to: walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length - 4)
            },
            {
              signature: "4PqRdnw9qZpU5gTC9Eqob2hsZXxVnB9GULsmgfJkJVgQZbp7sYMZYJPABAw9LJE6Y9fFQzL1FLSpnEE7zzRNc9X6",
              blockTime: Date.now() - 1000 * 60 * 30,
              type: "Swap",
              status: "confirmed",
              amount: "-10 USDC",
              from: walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length - 4),
              to: "0.05 SOL"
            },
            {
              signature: "5HvAyNxRJhY6RwtZ4QwzPJ21ZBU9f5P8rdBzx2pMRAQrMZoJWQ8YehJdhxmYw4GPDCYQXoJ6r6f1QphMTkTMLTUV",
              blockTime: Date.now() - 1000 * 60 * 120,
              type: "Transfer",
              status: "confirmed",
              amount: "-0.2 SOL",
              from: walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length - 4),
              to: "5zT...j2Lm"
            },
            {
              signature: "3yPwRGJTFH1hj9JbKCrguR4nMQUTPhgV9nnkfHLr8NQbFvpn8wZF784GYsEtiY9zk3qPLhkmRCnXUhJKJ9d1Fs4W",
              blockTime: Date.now() - 1000 * 60 * 240,
              type: "Swap",
              status: "confirmed",
              amount: "-1.5 SOL",
              from: walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length - 4),
              to: "325 JUP"
            },
            {
              signature: "2rM6rJoq4h3BpqojxLfEcETHcMkWQ5zdCAXpaU9KdJxmvmHbSigPKQ4c8bE14sJjLpBfqGbCXZUX5sdEJqtFrLXS",
              blockTime: Date.now() - 1000 * 60 * 360,
              type: "Transfer",
              status: "confirmed",
              amount: "+2.5 SOL",
              from: "8kL...D9t",
              to: walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length - 4)
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setIsLoading(false);
      }
    };

    if (walletAddress) {
      fetchTransactions();
    }
  }, [walletAddress]);

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
        {isLoading ? (
          <div className="py-6 text-center text-muted-foreground">
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
                  <p className={`font-medium ${tx.amount?.startsWith('+') ? 'text-green-500' : ''}`}>{tx.amount}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.type === "Swap" ? "For: " : "To: "}{tx.to}
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
