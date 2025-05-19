
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { transactionsService } from "@/services/transactionsService";
import { formatDate } from "@/utils/transactionUtils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { ExternalLink } from "lucide-react";

interface SwapTransaction {
  id: string;
  signature: string;
  amount: string;
  source: string;
  destination: string;
  status: string;
  block_time: string;
  created_at: string;
}

interface SwapTransactionsHistoryProps {
  selectedService?: "jupiter" | "raydium";
}

export function SwapTransactionsHistory({ selectedService }: SwapTransactionsHistoryProps) {
  const { walletAddress } = useWalletConnection();
  const [transactions, setTransactions] = useState<SwapTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      try {
        const data = await transactionsService.getTransactionsByWallet(walletAddress);
        // Filter for swap transactions only
        const swapTxs = data.filter(tx => tx.type === "swap");

        // Filter by service if specified (Jupiter signatures don't start with "raydium-")
        const filteredTxs = selectedService
          ? swapTxs.filter(tx => {
              if (selectedService === "raydium") {
                return tx.signature.startsWith("raydium-");
              } else {
                return !tx.signature.startsWith("raydium-");
              }
            })
          : swapTxs;

        setTransactions(filteredTxs as SwapTransaction[]);
      } catch (error) {
        console.error("Error loading swap transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [walletAddress, selectedService]);

  const truncateSignature = (signature: string) => {
    if (!signature) return "";
    return `${signature.substring(0, 4)}...${signature.substring(signature.length - 4)}`;
  };

  const getSolscanLink = (signature: string) => {
    // Don't generate Solscan links for mock Raydium transactions
    if (signature.startsWith("raydium-")) {
      return "#";
    }
    return `https://solscan.io/tx/${signature}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {selectedService 
            ? `${selectedService.charAt(0).toUpperCase() + selectedService.slice(1)} Swap History` 
            : "Swap History"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No swap transactions found{selectedService ? ` for ${selectedService}` : ""}
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div 
                key={tx.id}
                className="p-4 border rounded-lg flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant={tx.status === "success" ? "success" : "destructive"}>
                      {tx.status}
                    </Badge>
                    <div className="mt-1 font-medium">{tx.amount}</div>
                  </div>
                  {!tx.signature.startsWith("raydium-") ? (
                    <a 
                      href={getSolscanLink(tx.signature)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      {truncateSignature(tx.signature)}
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {truncateSignature(tx.signature)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(tx.created_at || tx.block_time)}
                </div>
                {tx.signature.startsWith("raydium-") && (
                  <div className="text-xs text-purple-500">
                    Raydium
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
