
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { Transaction } from "@/types/wallet";
import { solanaService } from "@/services/solanaService";

interface TransactionsCardProps {
  walletAddress: string | null;
  displayAddress: string;
}

export function TransactionsCard({ walletAddress, displayAddress }: TransactionsCardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Φόρτωση των πρόσφατων συναλλαγών όταν υπάρχει διεύθυνση πορτοφολιού
  useEffect(() => {
    const loadTransactions = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      try {
        const recentTransactions = await solanaService.getRecentTransactions(walletAddress, 5);
        setTransactions(recentTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [walletAddress]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Πρόσφατες Συναλλαγές</CardTitle>
        <CardDescription>Πρόσφατη δραστηριότητα στο πορτοφόλι σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p>Φόρτωση συναλλαγών...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Δεν βρέθηκαν πρόσφατες συναλλαγές</p>
          </div>
        ) : (
          transactions.map((tx, i) => (
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
                <p className={`font-medium ${tx.amount?.startsWith('+') ? 'text-green-500' : ''}`}>
                  {tx.amount || '-'}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {tx.status}
                </p>
              </div>
            </div>
          ))
        )}
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
