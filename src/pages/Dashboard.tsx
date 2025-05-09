
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Zap, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";

// Δεδομένα τιμών με περισσότερα σημεία για καλύτερη απεικόνιση
const marketData = [
  { name: "Jan", value: 0.5, volume: 2500 },
  { name: "Feb", value: 0.8, volume: 3200 },
  { name: "Mar", value: 1.2, volume: 4100 },
  { name: "Apr", value: 1.0, volume: 3800 },
  { name: "May", value: 1.8, volume: 5200 },
  { name: "Jun", value: 2.5, volume: 6300 },
  { name: "Jul", value: 2.0, volume: 5800 },
  { name: "Aug", value: 2.4, volume: 6100 },
  { name: "Sep", value: 2.8, volume: 7200 },
  { name: "Oct", value: 3.2, volume: 8100 },
];

// Πληροφορίες για τα bots
const botStatuses = [
  { name: "TokenBot-1", status: "active", profit: "+3.8%", tokens: "SOL/USDC", strategy: "DCA", lastTrade: "2h ago" },
  { name: "TokenBot-2", status: "inactive", profit: "-0.5%", tokens: "BTC/USDC", strategy: "Grid", lastTrade: "1d ago" },
  { name: "TokenBot-3", status: "active", profit: "+2.1%", tokens: "ETH/USDC", strategy: "Momentum", lastTrade: "4h ago" },
];

export default function Dashboard() {
  const [marketDataState, setMarketDataState] = useState(marketData);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("1D");

  // Προσομοίωση λήψης δεδομένων αγοράς
  useEffect(() => {
    const fetchMarketData = () => {
      setIsLoading(true);
      
      // Προσομοίωση API call
      setTimeout(() => {
        // Προσθήκη μικρής τυχαίας διακύμανσης στα δεδομένα για εφέ live data
        const updatedData = marketData.map(item => ({
          ...item,
          value: item.value * (1 + (Math.random() * 0.1 - 0.05)),
          volume: item.volume * (1 + (Math.random() * 0.1 - 0.05))
        }));
        
        setMarketDataState(updatedData);
        setIsLoading(false);
        toast.success("Market data updated");
      }, 1500);
    };
    
    fetchMarketData();
    
    // Ενημέρωση κάθε 30 δευτερόλεπτα
    const intervalId = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(intervalId);
  }, [timeframe]);

  // Χειρισμός αλλαγής χρονικού πλαισίου
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    toast.info(`Switched to ${newTimeframe} timeframe`);
  };

  // Χειρισμός εκκίνησης bot
  const handleActivateBot = (botName: string) => {
    toast.success(`${botName} activated successfully`);
  };

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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Market Performance</CardTitle>
              <CardDescription>Live price data with volume</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={timeframe === "1H" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleTimeframeChange("1H")}
              >
                1H
              </Button>
              <Button 
                variant={timeframe === "1D" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleTimeframeChange("1D")}
              >
                1D
              </Button>
              <Button 
                variant={timeframe === "1W" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleTimeframeChange("1W")}
              >
                1W
              </Button>
              <Button 
                variant={timeframe === "1M" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleTimeframeChange("1M")}
              >
                1M
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-80 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="text-xs text-muted-foreground">Loading market data...</span>
                </div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketDataState}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ background: "hsl(222 47% 13%)", border: "1px solid hsl(217 33% 20%)" }} 
                  formatter={(value: number) => [`${value.toFixed(2)} SOL`, "Price"]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#9945FF" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                  name="SOL Price"
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#00C6A2" 
                  strokeWidth={1} 
                  strokeDasharray="5 5"
                  name="Volume"
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
              <div key={bot.name} className="flex flex-col gap-2 border-b pb-3 last:border-0">
                <div className="flex items-center justify-between">
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
                <div className="grid grid-cols-2 text-xs text-muted-foreground">
                  <div>Strategy: <span className="font-medium">{bot.strategy}</span></div>
                  <div>Last trade: <span className="font-medium">{bot.lastTrade}</span></div>
                </div>
                {bot.status !== 'active' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-1"
                    onClick={() => handleActivateBot(bot.name)}
                  >
                    Activate Bot
                  </Button>
                )}
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
            {[
              { type: "Buy", token: "SOL", amount: "+0.5 SOL", value: "$42.50", time: new Date(Date.now() - 1 * 3600000), success: true },
              { type: "Sell", token: "BTC", amount: "-0.001 BTC", value: "$65.32", time: new Date(Date.now() - 5 * 3600000), success: true },
              { type: "Buy", token: "ETH", amount: "+0.025 ETH", value: "$53.18", time: new Date(Date.now() - 12 * 3600000), success: false }
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`${tx.type === "Buy" ? "text-green-400" : "text-red-400"} font-medium`}>
                      {tx.type} {tx.token}
                    </span>
                    {!tx.success && <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tx.time.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{tx.amount}</p>
                  <p className="text-sm text-muted-foreground">{tx.value}</p>
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
            <CardDescription>Live token price updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Solana", ticker: "SOL", change: "+12.4%", price: "$82.45", rising: true },
              { name: "Ethereum", ticker: "ETH", change: "+3.2%", price: "$2,345.67", rising: true },
              { name: "Bitcoin", ticker: "BTC", change: "-1.8%", price: "$42,345.12", rising: false },
              { name: "Raydium", ticker: "RAY", change: "+5.7%", price: "$4.87", rising: true },
              { name: "Jupiter", ticker: "JUP", change: "+9.3%", price: "$1.23", rising: true },
            ].map((token) => (
              <div key={token.ticker} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{token.name}</p>
                  <p className="text-sm text-muted-foreground">{token.ticker}</p>
                </div>
                <div className="text-right flex items-center gap-1">
                  <p className={`font-medium ${token.rising ? "text-green-400" : "text-red-400"}`}>{token.change}</p>
                  <div>
                    {token.rising ? 
                      <ArrowUpRight className="h-3.5 w-3.5 text-green-400" /> : 
                      <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                    }
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">{token.price}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              View All Markets
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automated Trading Strategies
          </CardTitle>
          <CardDescription>Configure and deploy advanced trading strategies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "DCA Strategy", description: "Dollar-cost averaging for consistent buying", status: "Available" },
              { name: "Grid Trading", description: "Profit from price fluctuations in a range", status: "Available" },
              { name: "Momentum Strategy", description: "Trade based on price momentum indicators", status: "Available" },
              { name: "Arbitrage Bot", description: "Profit from price differences across exchanges", status: "Pro Only" },
              { name: "Sniper Bot", description: "Target specific price levels for entry", status: "Pro Only" },
              { name: "Trailing Stop", description: "Dynamic stop-loss that follows price", status: "Pro Only" }
            ].map((strategy, idx) => (
              <Card key={idx} className="border border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{strategy.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      strategy.status === "Available" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {strategy.status}
                    </span>
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button variant="outline" size="sm" className="w-full">
                    {strategy.status === "Available" ? "Configure" : "Upgrade to Pro"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
