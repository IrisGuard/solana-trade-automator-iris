
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const transactions = [
  {
    id: "TX123456",
    type: "buy",
    token: "SOL",
    amount: "0.5",
    price: "$82.45",
    value: "$41.23",
    timestamp: "2023-05-09T09:24:15Z",
    status: "completed",
    bot: "SOL/USDC Bot",
  },
  {
    id: "TX123457",
    type: "sell",
    token: "ETH",
    amount: "0.02",
    price: "$2,345.67",
    value: "$46.91",
    timestamp: "2023-05-09T08:15:22Z",
    status: "completed",
    bot: "ETH/USDC Bot",
  },
  {
    id: "TX123458",
    type: "buy",
    token: "BTC",
    amount: "0.001",
    price: "$42,345.12",
    value: "$42.35",
    timestamp: "2023-05-08T23:45:11Z",
    status: "completed",
    bot: "BTC/USDC Bot",
  },
  {
    id: "TX123459",
    type: "sell",
    token: "SOL",
    amount: "1.2",
    price: "$80.15",
    value: "$96.18",
    timestamp: "2023-05-08T17:32:45Z",
    status: "completed",
    bot: "SOL/USDC Bot",
  },
  {
    id: "TX123460",
    type: "buy",
    token: "RAY",
    amount: "25",
    price: "$1.25",
    value: "$31.25",
    timestamp: "2023-05-08T12:10:05Z",
    status: "completed",
    bot: "Manual",
  },
  {
    id: "TX123461",
    type: "sell",
    token: "BTC",
    amount: "0.002",
    price: "$42,100.50",
    value: "$84.20",
    timestamp: "2023-05-07T22:05:33Z",
    status: "completed",
    bot: "BTC/USDC Bot",
  },
  {
    id: "TX123462",
    type: "buy",
    token: "ETH",
    amount: "0.05",
    price: "$2,340.20",
    value: "$117.01",
    timestamp: "2023-05-07T16:28:19Z",
    status: "completed",
    bot: "ETH/USDC Bot",
  },
  {
    id: "TX123463",
    type: "buy",
    token: "SOL",
    amount: "2.0",
    price: "$78.50",
    value: "$157.00",
    timestamp: "2023-05-07T09:14:02Z",
    status: "completed",
    bot: "SOL/USDC Bot",
  },
  {
    id: "TX123464",
    type: "sell",
    token: "RAY",
    amount: "15",
    price: "$1.30",
    value: "$19.50",
    timestamp: "2023-05-06T20:45:37Z",
    status: "completed",
    bot: "Manual",
  },
  {
    id: "TX123465",
    type: "buy",
    token: "ETH",
    amount: "0.08",
    price: "$2,320.75",
    value: "$185.66",
    timestamp: "2023-05-06T14:32:11Z",
    status: "completed",
    bot: "ETH/USDC Bot",
  },
];

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tokenFilter, setTokenFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  // Filter transactions based on search, type, and token
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tx.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.bot.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    const matchesToken = tokenFilter === "all" || tx.token === tokenFilter;
    
    return matchesSearch && matchesType && matchesToken;
  });

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Get unique tokens for filter dropdown
  const uniqueTokens = Array.from(new Set(transactions.map(tx => tx.token)));

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your trading activities</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Label>Transaction Type:</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Token:</Label>
                <Select value={tokenFilter} onValueChange={setTokenFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tokens</SelectItem>
                    {uniqueTokens.map(token => (
                      <SelectItem key={token} value={token}>{token}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>

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
                  {currentTransactions.length > 0 ? (
                    currentTransactions.map((tx) => (
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

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>Overview of your trading activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Last 30 days
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Trading Volume</p>
                <p className="text-2xl font-bold">$1,246.50</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Last 30 days
                </p>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <p className="mb-2 font-medium">Transaction Breakdown</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Buy Transactions</span>
                    <span className="font-medium">{transactions.filter(tx => tx.type === "buy").length}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-green-400"
                      style={{
                        width: `${(transactions.filter(tx => tx.type === "buy").length / transactions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Sell Transactions</span>
                    <span className="font-medium">{transactions.filter(tx => tx.type === "sell").length}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-red-400"
                      style={{
                        width: `${(transactions.filter(tx => tx.type === "sell").length / transactions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Activity</CardTitle>
            <CardDescription>Trading activity by token</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uniqueTokens.map(token => {
              const tokenTxs = transactions.filter(tx => tx.token === token);
              const buyTxs = tokenTxs.filter(tx => tx.type === "buy");
              const sellTxs = tokenTxs.filter(tx => tx.type === "sell");
              
              return (
                <div key={token} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                        {token[0]}
                      </div>
                      <span className="font-medium">{token}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {tokenTxs.length} transactions
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        Buy ({buyTxs.length})
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-red-400" />
                        Sell ({sellTxs.length})
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary flex">
                      <div
                        className="h-full bg-green-400"
                        style={{
                          width: tokenTxs.length ? `${(buyTxs.length / tokenTxs.length) * 100}%` : '0%',
                        }}
                      />
                      <div
                        className="h-full bg-red-400"
                        style={{
                          width: tokenTxs.length ? `${(sellTxs.length / tokenTxs.length) * 100}%` : '0%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Label component
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-medium">
      {children}
    </span>
  );
}
