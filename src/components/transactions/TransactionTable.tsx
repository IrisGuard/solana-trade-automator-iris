
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  token: string;
  amount: string;
  price: string;
  value: string;
  timestamp: string;
  status: string;
  bot: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  formatDate: (dateString: string) => string;
}

export function TransactionTable({ transactions, formatDate }: TransactionTableProps) {
  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Token</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Bot</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <TableRow key={tx.id} className="cursor-pointer hover:bg-accent/50">
                <TableCell>
                  {tx.type === "buy" ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-400">
                      <ArrowDown className="mr-1 h-3 w-3" />
                      Buy
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-400">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      Sell
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">{tx.token}</TableCell>
                <TableCell className="text-right">{tx.amount}</TableCell>
                <TableCell className="text-right">{tx.price}</TableCell>
                <TableCell className="text-right">{tx.value}</TableCell>
                <TableCell>{formatDate(tx.timestamp)}</TableCell>
                <TableCell>{tx.bot}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-green-500/10 text-green-400">
                    {tx.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
