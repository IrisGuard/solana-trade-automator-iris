
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlayCircle, StopCircle, Settings2, Flame, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Token } from "@/types/wallet";
import { formatAmount } from "@/utils/tokenUtils";

interface TokenBotProps {
  tokens: Token[];
  isConnected: boolean;
  onConnectWallet: () => Promise<void>;
}

export function TokenBot({ tokens, isConnected, onConnectWallet }: TokenBotProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [botRunning, setBotRunning] = useState(false);
  const [settings, setSettings] = useState({
    buyThreshold: 0.5,
    sellThreshold: 1.5,
    tradeAmount: 0.1,
    stopLoss: 0.2,
    takeProfit: 2.0,
    autoRebalance: false,
    trailingStop: false,
    tradingEnabled: true
  });

  // Find the selected token details
  const tokenDetails = tokens.find(t => t.address === selectedToken);
  
  const handleStartBot = () => {
    if (!selectedToken) {
      toast.error("Please select a token first");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setBotRunning(true);
      setIsLoading(false);
      toast.success(`Bot started for ${tokenDetails?.symbol}`);
    }, 1500);
  };
  
  const handleStopBot = () => {
    setIsLoading(true);
    setTimeout(() => {
      setBotRunning(false);
      setIsLoading(false);
      toast.info("Bot stopped");
    }, 1000);
  };
  
  const handleUpdateSettings = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Trading Bot</CardTitle>
          <CardDescription>
            Connect your wallet to use the token trading bot
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={onConnectWallet}>Connect Wallet to Start</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Token Trading Bot
          {botRunning && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Automate your trading strategy with customizable parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <div className="mb-4">
            <Label htmlFor="token-select">Select Token</Label>
            <Select 
              value={selectedToken || ""} 
              onValueChange={setSelectedToken}
              disabled={botRunning}
            >
              <SelectTrigger id="token-select">
                <SelectValue placeholder="Select a token to trade" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map(token => (
                  <SelectItem key={token.address} value={token.address}>
                    {token.symbol} ({formatAmount(token.balance || 0)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="trade-amount">Trade Amount</Label>
                <div className="flex gap-2">
                  <Input 
                    id="trade-amount"
                    type="number" 
                    value={settings.tradeAmount} 
                    onChange={(e) => handleUpdateSettings('tradeAmount', parseFloat(e.target.value))}
                    disabled={botRunning}
                  />
                  <span className="py-2">
                    {tokenDetails?.symbol || "Tokens"}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="buy-threshold">Buy Threshold</Label>
                  <span>{settings.buyThreshold}%</span>
                </div>
                <Slider 
                  id="buy-threshold"
                  value={[settings.buyThreshold]} 
                  min={0.1} 
                  max={5} 
                  step={0.1}
                  onValueChange={([value]) => handleUpdateSettings('buyThreshold', value)}
                  disabled={botRunning}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="sell-threshold">Sell Threshold</Label>
                  <span>{settings.sellThreshold}%</span>
                </div>
                <Slider 
                  id="sell-threshold"
                  value={[settings.sellThreshold]} 
                  min={0.5} 
                  max={10} 
                  step={0.1}
                  onValueChange={([value]) => handleUpdateSettings('sellThreshold', value)}
                  disabled={botRunning}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="trading-enabled">Trading Enabled</Label>
                <Switch 
                  id="trading-enabled"
                  checked={settings.tradingEnabled} 
                  onCheckedChange={(checked) => handleUpdateSettings('tradingEnabled', checked)}
                  disabled={botRunning}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="stop-loss">Stop Loss</Label>
                  <span>{settings.stopLoss}%</span>
                </div>
                <Slider 
                  id="stop-loss"
                  value={[settings.stopLoss]} 
                  min={0.1} 
                  max={5} 
                  step={0.1}
                  onValueChange={([value]) => handleUpdateSettings('stopLoss', value)}
                  disabled={botRunning}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="take-profit">Take Profit</Label>
                  <span>{settings.takeProfit}%</span>
                </div>
                <Slider 
                  id="take-profit"
                  value={[settings.takeProfit]} 
                  min={1} 
                  max={10} 
                  step={0.1}
                  onValueChange={([value]) => handleUpdateSettings('takeProfit', value)}
                  disabled={botRunning}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-rebalance">Auto Rebalance</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically adjust position sizes
                  </p>
                </div>
                <Switch 
                  id="auto-rebalance"
                  checked={settings.autoRebalance} 
                  onCheckedChange={(checked) => handleUpdateSettings('autoRebalance', checked)}
                  disabled={botRunning}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="trailing-stop">Trailing Stop</Label>
                  <p className="text-sm text-muted-foreground">
                    Adjust stop loss with price increases
                  </p>
                </div>
                <Switch 
                  id="trailing-stop"
                  checked={settings.trailingStop} 
                  onCheckedChange={(checked) => handleUpdateSettings('trailingStop', checked)}
                  disabled={botRunning}
                />
              </div>
            </div>
          </TabsContent>
          
          <div className="mt-6 flex gap-4">
            {botRunning ? (
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={handleStopBot}
                disabled={isLoading}
              >
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Bot
              </Button>
            ) : (
              <Button 
                className="flex-1"
                onClick={handleStartBot}
                disabled={isLoading || !selectedToken}
              >
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Bot
              </Button>
            )}
            
            <Button variant="outline" className="flex-1">
              <Settings2 className="mr-2 h-4 w-4" />
              Save Template
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
