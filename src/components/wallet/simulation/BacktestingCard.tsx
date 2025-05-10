
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BacktestingCard() {
  return (
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
  );
}
