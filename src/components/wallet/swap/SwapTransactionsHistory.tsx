
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { transactionsService } from "@/services/transactionsService";
import { formatDate } from "@/utils/transactionUtils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { ExternalLink, Clock } from "lucide-react";

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
      if (!walletAddress) {
        setIsLoading(false);
        return;
      }
      
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

  const getServiceBadge = (signature: string) => {
    const isRaydium = signature.startsWith("raydium-");
    return (
      <Badge variant={isRaydium ? "purple" : "blue"} className="ml-2">
        {isRaydium ? "Raydium" : "Jupiter"}
      </Badge>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
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
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="mx-auto h-12 w-12 opacity-30 mb-3" />
            <p>No swap transactions found{selectedService ? ` for ${selectedService}` : ""}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <div 
                key={tx.id}
                className="p-4 border rounded-lg flex flex-col gap-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant={tx.status === "success" ? "success" : "destructive"}>
                      {tx.status}
                    </Badge>
                    {getServiceBadge(tx.signature)}
                    <div className="mt-2 font-medium">{tx.amount}</div>
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
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(tx.created_at || tx.block_time)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
