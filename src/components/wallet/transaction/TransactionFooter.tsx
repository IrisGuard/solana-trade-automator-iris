
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Transaction } from "@/types/transaction";

interface TransactionFooterProps {
  walletAddress: string | null;
  showViewAll: boolean;
  transactions: Transaction[];
}

export function TransactionFooter({ 
  walletAddress, 
  showViewAll, 
  transactions 
}: TransactionFooterProps) {
  if (!walletAddress) return null;
  
  if (transactions.length === 0) return null;
  
  if (showViewAll) {
    return (
      <div className="text-right">
        <Link to="/transactions">
          <Button variant="ghost" size="sm" className="gap-1">
            Προβολή όλων <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    );
  }
  
  return null;
}
