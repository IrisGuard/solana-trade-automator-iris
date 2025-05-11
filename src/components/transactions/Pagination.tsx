
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  indexOfFirstTransaction: number;
  indexOfLastTransaction: number;
  totalTransactions: number;
}

export function TransactionPagination({
  currentPage,
  setCurrentPage,
  totalPages,
  indexOfFirstTransaction,
  indexOfLastTransaction,
  totalTransactions
}: PaginationProps) {
  const goToPreviousPage = () => {
    // Direct number assignment instead of using a callback function
    setCurrentPage(Math.max(currentPage - 1, 1));
  };
  
  const goToNextPage = () => {
    // Direct number assignment instead of using a callback function
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, totalTransactions)} of {totalTransactions} transactions
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className="h-8 w-8"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
