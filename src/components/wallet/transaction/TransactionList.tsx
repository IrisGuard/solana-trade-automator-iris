
import React from "react";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { TransactionItem } from "./TransactionItem";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  walletAddress: string | null;
  limit: number;
  getStatusBadgeClass: (status: string) => string;
  getTypeIcon: (type: string) => string;
}

export function TransactionList({
  transactions,
  isLoading,
  walletAddress,
  limit,
  getStatusBadgeClass,
  getTypeIcon
}: TransactionListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ημερομηνία</TableHead>
            <TableHead>Τύπος</TableHead>
            <TableHead>Ποσό</TableHead>
            <TableHead>Token</TableHead>
            <TableHead className="hidden md:table-cell">Κατάσταση</TableHead>
            <TableHead className="text-right">Ενέργειες</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.slice(0, limit).map((tx) => (
              <TransactionItem 
                key={tx.signature || tx.id} 
                transaction={tx} 
                walletAddress={walletAddress}
                getStatusBadgeClass={getStatusBadgeClass}
                getTypeIcon={getTypeIcon}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Δεν βρέθηκαν συναλλαγές</span>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
