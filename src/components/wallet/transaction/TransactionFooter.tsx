
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
  
  const handleViewAllClick = () => {
    window.open(`https://solscan.io/account/${walletAddress}?cluster=mainnet`, '_blank');
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full hover:bg-primary/5"
      onClick={handleViewAllClick}
    >
      Προβολή Όλων των Συναλλαγών <ExternalLink className="ml-2 h-3 w-3" />
    </Button>
  );
}
