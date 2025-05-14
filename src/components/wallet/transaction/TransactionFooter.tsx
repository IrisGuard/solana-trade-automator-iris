
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Transaction } from "@/types/transaction";

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
  if (!showViewAll || transactions.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <Link to="/transactions">
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center"
          disabled={!walletAddress}
        >
          <span>Προβολή όλων των συναλλαγών</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
