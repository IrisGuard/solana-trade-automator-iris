
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

export function SimulationTab() {
  return (
    <TabsContent value="simulation" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Backtesting</CardTitle>
            <CardDescription>Test strategies on historical data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backtest-strategy">Trading Strategy</Label>
              <Select>
                <SelectTrigger id="backtest-strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dca">Dollar-Cost Averaging</SelectItem>
                  <SelectItem value="grid">Grid Trading</SelectItem>
                  <SelectItem value="momentum">Momentum Trading</SelectItem>
                  <SelectItem value="custom">Custom Strategy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backtest-pair">Trading Pair</Label>
              <Select>
                <SelectTrigger id="backtest-pair">
                  <SelectValue placeholder="Select pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sol_usdc">SOL/USDC</SelectItem>
                  <SelectItem value="btc_usdc">BTC/USDC</SelectItem>
                  <SelectItem value="eth_usdc">ETH/USDC</SelectItem>
                  <SelectItem value="jup_usdc">JUP/USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backtest-period">Time Period</Label>
              <Select>
                <SelectTrigger id="backtest-period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 Hours</SelectItem>
                  <SelectItem value="1w">Last Week</SelectItem>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backtest-capital">Initial Capital (USDC)</Label>
              <Input id="backtest-capital" type="number" defaultValue="1000" />
            </div>
            
            <Button className="w-full">
              Run Backtest
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Simulation Settings</CardTitle>
            <CardDescription>Configure virtual trading environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Market Conditions</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">Bullish</Button>
                <Button variant="default" size="sm">Neutral</Button>
                <Button variant="outline" size="sm">Bearish</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sim-volatility">Market Volatility: 25%</Label>
              <Slider 
                id="sim-volatility"
                min={5} 
                max={50} 
                step={5}
                defaultValue={[25]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sim-liquidity">Simulated Liquidity: Medium</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="sim-liquidity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sim-slippage">Slippage Tolerance: 1.5%</Label>
              <Slider 
                id="sim-slippage"
                min={0.1} 
                max={3.0} 
                step={0.1}
                defaultValue={[1.5]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sim-speed">Simulation Speed</Label>
              <Select defaultValue="normal">
                <SelectTrigger id="sim-speed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow (1x)</SelectItem>
                  <SelectItem value="normal">Normal (10x)</SelectItem>
                  <SelectItem value="fast">Fast (100x)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="sim-logs" defaultChecked />
              <Label htmlFor="sim-logs">Enable detailed logs</Label>
            </div>

            <Button className="w-full">
              Start New Simulation
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
          <CardDescription>Performance metrics from simulations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Return", value: "+12.8%", positive: true },
              { label: "Max Drawdown", value: "-4.3%", positive: false },
              { label: "Win Rate", value: "68%", positive: true },
              { label: "Sharpe Ratio", value: "1.74", positive: true }
            ].map((stat, i) => (
              <Card key={i} className="border border-muted">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="pt-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Latest Simulation</h4>
              <p className="text-sm text-muted-foreground">Run 2 hours ago</p>
            </div>
            
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <p>Strategy</p>
                <p className="font-medium">Grid Trading</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p>Trading Pair</p>
                <p className="font-medium">SOL/USDC</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p>Period</p>
                <p className="font-medium">Last Week</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p>Initial Capital</p>
                <p className="font-medium">1,000 USDC</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p>Final Capital</p>
                <p className="font-medium text-green-400">1,128 USDC</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p>Trades Executed</p>
                <p className="font-medium">47</p>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" className="w-full">View Detailed Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
