
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function CreateBotCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Bot</CardTitle>
        <CardDescription>
          Configure a new trading bot with custom parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Bot Name</Label>
            <Input id="bot-name" placeholder="My Trading Bot" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="base-token">Base Token</Label>
            <Select>
              <SelectTrigger id="base-token">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sol">SOL</SelectItem>
                <SelectItem value="btc">BTC</SelectItem>
                <SelectItem value="eth">ETH</SelectItem>
                <SelectItem value="ray">RAY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quote-token">Quote Token</Label>
            <Select defaultValue="usdc">
              <SelectTrigger id="quote-token">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usdc">USDC</SelectItem>
                <SelectItem value="usdt">USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="strategy">Trading Strategy</Label>
            <Select>
              <SelectTrigger id="strategy">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="momentum">Momentum Trading</SelectItem>
                <SelectItem value="arbitrage">Arbitrage</SelectItem>
                <SelectItem value="grid">Grid Trading</SelectItem>
                <SelectItem value="scalping">Scalping</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance Allocation</Label>
            <Input id="balance" placeholder="25%" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="max-trade">Max Trade Size</Label>
            <Input id="max-trade" placeholder="0.5 SOL" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="take-profit">Take Profit (%)</Label>
            <Input id="take-profit" placeholder="3%" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stop-loss">Stop Loss (%)</Label>
            <Input id="stop-loss" placeholder="1.5%" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Risk Level</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs">Conservative</span>
            <Slider defaultValue={[30]} max={100} step={1} className="flex-grow" />
            <span className="text-xs">Aggressive</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="auto-compound" defaultChecked />
          <Label htmlFor="auto-compound">Auto-compound profits</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto">Create Bot</Button>
      </CardFooter>
    </Card>
  );
}
