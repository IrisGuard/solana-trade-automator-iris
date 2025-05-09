
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: "Jan", value: 0.5 },
  { name: "Feb", value: 0.8 },
  { name: "Mar", value: 1.2 },
  { name: "Apr", value: 1.0 },
  { name: "May", value: 1.8 },
  { name: "Jun", value: 2.5 },
  { name: "Jul", value: 2.0 },
  { name: "Aug", value: 2.4 },
];

const botStatuses = [
  { name: "TokenBot-1", status: "active", profit: "+3.8%", tokens: "SOL/USDC" },
  { name: "TokenBot-2", status: "inactive", profit: "-0.5%", tokens: "BTC/USDC" },
  { name: "TokenBot-3", status: "active", profit: "+2.1%", tokens: "ETH/USDC" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-3xl">$12,546.76</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-400 flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+5.25% this week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Bots</CardDescription>
            <CardTitle className="text-3xl">2/3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Last bot activated 2 hours ago
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Profit</CardDescription>
            <CardTitle className="text-3xl text-green-400">+$325.42</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Last 24 hours: +$42.24
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Daily trading profit/loss</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ background: "hsl(222 47% 13%)", border: "1px solid hsl(217 33% 20%)" }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#9945FF" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                  name="Profit (SOL)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bot Status</CardTitle>
            <CardDescription>Active and inactive bots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {botStatuses.map((bot) => (
              <div key={bot.name} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{bot.name}</p>
                  <p className="text-sm text-muted-foreground">{bot.tokens}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-sm ${bot.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {bot.profit}
                  </div>
                  <div 
                    className={`h-3 w-3 rounded-full ${
                      bot.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-muted'
                    }`} 
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              View All Bots
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest bot trading activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">Buy SOL</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(Date.now() - i * 3600000).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">+0.5 SOL</p>
                  <p className="text-sm text-muted-foreground">$42.50</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              View All Transactions
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
            <CardDescription>Top performing tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Solana", ticker: "SOL", change: "+12.4%", price: "$82.45" },
              { name: "Ethereum", ticker: "ETH", change: "+3.2%", price: "$2,345.67" },
              { name: "Bitcoin", ticker: "BTC", change: "+1.8%", price: "$42,345.12" },
            ].map((token) => (
              <div key={token.ticker} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{token.name}</p>
                  <p className="text-sm text-muted-foreground">{token.ticker}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-400">{token.change}</p>
                  <p className="text-sm text-muted-foreground">{token.price}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              View Market Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
