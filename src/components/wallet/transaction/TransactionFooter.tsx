
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface TransactionFooterProps {
  walletAddress: string | null;
  showViewAll: boolean;
  transactions: any[];
}

export function TransactionFooter({ 
  walletAddress, 
  showViewAll, 
  transactions 
}: TransactionFooterProps) {
  if (!walletAddress || !showViewAll || transactions.length === 0) {
    return null;
  }
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full"
      onClick={() => window.open(`https://solscan.io/account/${walletAddress}?cluster=mainnet`, '_blank')}
    >
      Προβολή Όλων των Συναλλαγών <ExternalLink className="ml-2 h-3 w-3" />
    </Button>
  );
}
