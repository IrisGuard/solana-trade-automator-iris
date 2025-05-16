
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { Transaction } from "@/types/transaction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface TransactionItemProps {
  transaction: Transaction;
  walletAddress?: string | null;
  getStatusBadgeClass?: (status: string) => string;
  getTypeIcon?: (type: string) => string;
}

export function TransactionItem({ 
  transaction, 
  walletAddress,
  getStatusBadgeClass = (status) => status.toLowerCase().includes('success') 
    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  getTypeIcon = (type) => {
    if (type.toLowerCase().includes('send')) return '↑';
    if (type.toLowerCase().includes('receive')) return '↓';
    if (type.toLowerCase().includes('swap')) return '↔';
    return '•';
  }
}: TransactionItemProps) {
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle display of transaction amount with direction
  const displayAmount = () => {
    try {
      const amount = parseFloat(String(transaction.amount || 0));
      const token = transaction.token || 'SOL';
      
      if (transaction.type.toLowerCase().includes('receive') || 
          (transaction.from && transaction.to === walletAddress)) {
        return <span className="text-green-600 dark:text-green-400">+{amount.toFixed(4)} {token}</span>;
      } else {
        return <span className="text-red-600 dark:text-red-400">-{amount.toFixed(4)} {token}</span>;
      }
    } catch (e) {
      return <span>{transaction.amount} {transaction.token || 'SOL'}</span>;
    }
  };

  return (
    <TableRow>
      <TableCell>{formatDate(transaction.blockTime * 1000)}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <span className="mr-1">{getTypeIcon(transaction.type)}</span>
          {transaction.type}
        </div>
      </TableCell>
      <TableCell>{displayAmount()}</TableCell>
      <TableCell>{transaction.token || transaction.tokenAddress || 'SOL'}</TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="default" className={getStatusBadgeClass(transaction.status || 'Success')}>
          {transaction.status || 'Success'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Άνοιγμα μενού</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              window.open(
                `https://explorer.solana.com/tx/${transaction.signature}`,
                '_blank'
              );
            }}>
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>Προβολή στο Explorer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
