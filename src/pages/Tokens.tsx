
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const tokens = [
  { 
    name: "Solana", 
    symbol: "SOL", 
    price: "$82.45", 
    balance: "2.5", 
    value: "$206.13", 
    change24h: "+5.2%",
    status: "active"
  },
  { 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: "$42,345.12", 
    balance: "0.005", 
    value: "$211.73", 
    change24h: "+1.8%",
    status: "inactive"
  },
  { 
    name: "Ethereum", 
    symbol: "ETH", 
    price: "$2,345.67", 
    balance: "0.1", 
    value: "$234.57", 
    change24h: "+3.2%",
    status: "active"
  },
  { 
    name: "USDC", 
    symbol: "USDC", 
    price: "$1.00", 
    balance: "158.42", 
    value: "$158.42", 
    change24h: "0.0%",
    status: "active"
  },
  { 
    name: "Raydium", 
    symbol: "RAY", 
    price: "$1.25", 
    balance: "50", 
    value: "$62.50", 
    change24h: "-2.4%",
    status: "active"
  }
];

export default function Tokens() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatValue = (value: string) => {
    return parseFloat(value.replace('$', '')).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>My Tokens</CardTitle>
              <CardDescription>Manage your tokens and balances</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tokens..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>Deposit</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="px-4 pt-4">
            <TabsList>
              <TabsTrigger value="all">All Tokens</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="staked">Staked</TabsTrigger>
            </TabsList>
            <div className="flex items-center justify-end gap-2 py-4">
              <Select defaultValue="balance">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balance">Sort by Balance</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="price">Sort by Price</SelectItem>
                  <SelectItem value="change">Sort by 24h Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TabsContent value="all" className="m-0">
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">24h Change</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTokens.map((token) => (
                      <TableRow key={token.symbol}>
                        <TableCell className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            {token.symbol[0]}
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.symbol}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{token.price}</TableCell>
                        <TableCell className="text-right">{token.balance}</TableCell>
                        <TableCell className="text-right">{token.value}</TableCell>
                        <TableCell className={`text-right ${token.change24h.startsWith('+') ? 'text-green-400' : token.change24h.startsWith('-') ? 'text-red-400' : ''}`}>
                          {token.change24h}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Trade</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTokens.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No tokens found matching your search
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="active" className="m-0">
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">24h Change</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTokens
                      .filter(token => token.status === 'active')
                      .map((token) => (
                        <TableRow key={token.symbol}>
                          <TableCell className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                              {token.symbol[0]}
                            </div>
                            <div>
                              <div className="font-medium">{token.name}</div>
                              <div className="text-sm text-muted-foreground">{token.symbol}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{token.price}</TableCell>
                          <TableCell className="text-right">{token.balance}</TableCell>
                          <TableCell className="text-right">{token.value}</TableCell>
                          <TableCell className={`text-right ${token.change24h.startsWith('+') ? 'text-green-400' : token.change24h.startsWith('-') ? 'text-red-400' : ''}`}>
                            {token.change24h}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">Trade</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="staked" className="m-0 p-6 text-center">
              <div className="py-6">
                <h3 className="text-lg font-medium">No Staked Tokens</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any staked tokens. Stake tokens to earn rewards.
                </p>
                <Button className="mt-4">Stake Tokens</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Distribution</CardTitle>
            <CardDescription>Allocation of your tokens by value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tokens.map((token) => {
                const valueWithoutDollar = parseFloat(token.value.replace('$', ''));
                const totalPortfolioValue = tokens.reduce((sum, t) => sum + parseFloat(t.value.replace('$', '')), 0);
                const percentage = (valueWithoutDollar / totalPortfolioValue) * 100;
                
                return (
                  <div key={token.symbol} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" style={{ opacity: 0.5 + (percentage / 100) }} />
                        <span className="text-sm">{token.name}</span>
                      </div>
                      <span className="text-sm">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buy Tokens</CardTitle>
            <CardDescription>Purchase tokens for your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Token</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map(token => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-primary" />
                          <span>{token.name} ({token.symbol})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (USDC)</Label>
                <Input placeholder="0.00" />
              </div>
              <div className="rounded-md bg-secondary p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span>1 SOL ≈ 82.45 USDC</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fee</span>
                  <span>0.35%</span>
                </div>
              </div>
              <Button className="w-full">Buy Tokens</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Label component
function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </label>
  );
}
