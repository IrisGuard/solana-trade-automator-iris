
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Check, ChevronDown, ChevronUp, Play, Square } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BotCardProps {
  botName: string;
  isActive: boolean;
  tokens: string[];
  profit: string;
  timeRunning: string;
  index: number;
}

const BotCard = ({ botName, isActive, tokens, profit, timeRunning, index }: BotCardProps) => {
  const [active, setActive] = useState(isActive);
  const [expanded, setExpanded] = useState(false);

  const toggleBot = () => {
    setActive(!active);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{botName}</CardTitle>
          <Switch checked={active} onCheckedChange={toggleBot} />
        </div>
        <CardDescription>
          Trading {tokens.join("/")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Profit</p>
            <p className={`text-lg font-medium ${profit.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {profit}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Running for</p>
            <p className="text-lg font-medium">{timeRunning}</p>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor={`strategy-${index}`}>Trading Strategy</Label>
              <Select defaultValue="momentum">
                <SelectTrigger id={`strategy-${index}`}>
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
              <Label>Risk Level</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs">Low</span>
                <Slider defaultValue={[50]} max={100} step={1} className="flex-grow" />
                <span className="text-xs">High</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`max-trade-${index}`}>Max Trade Size</Label>
                <Input 
                  id={`max-trade-${index}`} 
                  placeholder="0.5 SOL"
                  defaultValue="0.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`take-profit-${index}`}>Take Profit (%)</Label>
                <Input 
                  id={`take-profit-${index}`} 
                  placeholder="2.5%"
                  defaultValue="2.5"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`stop-loss-${index}`}>Stop Loss (%)</Label>
                <Input 
                  id={`stop-loss-${index}`} 
                  placeholder="1.0%"
                  defaultValue="1.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`interval-${index}`}>Trading Interval</Label>
                <Select defaultValue="5m">
                  <SelectTrigger id={`interval-${index}`}>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 minute</SelectItem>
                    <SelectItem value="5m">5 minutes</SelectItem>
                    <SelectItem value="15m">15 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="4h">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id={`dca-${index}`} defaultChecked={true} />
              <Label htmlFor={`dca-${index}`}>Enable Dollar-Cost Averaging</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id={`notifications-${index}`} defaultChecked={true} />
              <Label htmlFor={`notifications-${index}`}>Trading Notifications</Label>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost"
          size="sm"
          className="ml-auto flex items-center gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              More <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function BotControl() {
  const bots = [
    { 
      botName: "SOL/USDC Bot",
      isActive: true,
      tokens: ["SOL", "USDC"],
      profit: "+3.8%",
      timeRunning: "12h 34m",
    },
    { 
      botName: "BTC/USDC Bot",
      isActive: false,
      tokens: ["BTC", "USDC"],
      profit: "-0.5%",
      timeRunning: "0h 0m",
    },
    { 
      botName: "ETH/USDC Bot",
      isActive: true,
      tokens: ["ETH", "USDC"],
      profit: "+2.1%",
      timeRunning: "5h 17m",
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Bots</TabsTrigger>
            <TabsTrigger value="all">All Bots</TabsTrigger>
            <TabsTrigger value="templates">Bot Templates</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-1">
              <Square className="h-4 w-4" />
              Stop All
            </Button>
            <Button size="sm" className="gap-1">
              <Play className="h-4 w-4" />
              Start All
            </Button>
          </div>
        </div>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bots.filter(bot => bot.isActive).map((bot, index) => (
              <BotCard key={index} {...bot} index={index} />
            ))}
          </div>
          {bots.filter(bot => bot.isActive).length === 0 && (
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <Bot className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Active Bots</h3>
              <p className="text-sm text-muted-foreground">
                You don't have any active bots right now. Start a bot to begin trading.
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bots.map((bot, index) => (
              <BotCard key={index} {...bot} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>DCA Momentum Bot</CardTitle>
                <CardDescription>
                  Dollar-cost averaging with momentum indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">Auto-adjusting position sizes</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">Momentum indicators</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">Dollar-cost averaging</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Use Template</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Arbitrage Bot</CardTitle>
                <CardDescription>
                  Profit from price differences across exchanges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">Multi-exchange support</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">Real-time price comparison</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">Auto-execution</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Use Template</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grid Trading Bot</CardTitle>
                <CardDescription>
                  Place buy/sell orders at regular price intervals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">Customizable price grid</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">Profit from price volatility</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">Auto grid rebalancing</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Use Template</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
    </div>
  );
}
