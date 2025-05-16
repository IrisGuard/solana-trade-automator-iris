
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
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
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // If no wallet or no transactions, don't show footer
  if (!walletAddress || transactions.length === 0) {
    return null;
  }
  
  return (
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
      {showViewAll && (
        <Button
          variant="outline"
          onClick={() => navigate('/transactions')}
          className="text-sm"
        >
          {t("general.viewAll", "Προβολή Όλων")}
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      )}
      
      <div className="text-xs text-gray-400">
        {transactions.length} {t("transactions.recentTransactions", "πρόσφατες συναλλαγές")}
      </div>
    </div>
  );
}
