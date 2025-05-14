
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
import { formatTokenAmount } from "@/utils/tokenUtils";

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
      toast.info(`Bot stopped for ${tokenDetails?.symbol}`);
    }, 1000);
  };
  
  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast.success(`Setting updated: ${key}`);
  };
  
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Bot</CardTitle>
          <CardDescription>Connect your wallet to use the trading bot</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <div className="mb-6">
            <Settings2 className="w-20 h-20 text-muted-foreground" />
          </div>
          <Button onClick={onConnectWallet}>
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Bot</CardTitle>
        <CardDescription>Automate your trading with our advanced bot</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Strategy</TabsTrigger>
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="space-y-4">
              <div>
                <Label htmlFor="token-select">Select Token</Label>
                <Select 
                  value={selectedToken || ""} 
                  onValueChange={setSelectedToken}
                >
                  <SelectTrigger id="token-select">
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        <div className="flex items-center">
                          {token.logo ? (
                            <img 
                              src={token.logo} 
                              alt={token.symbol} 
                              className="w-4 h-4 mr-2 rounded-full"
                            />
                          ) : (
                            <div className="w-4 h-4 mr-2 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs">{token.symbol.substring(0, 1)}</span>
                            </div>
                          )}
                          {token.symbol} - {formatTokenAmount(token.amount, token.decimals)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="trading-enabled">Trading Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable automatic trading
                  </p>
                </div>
                <Switch 
                  id="trading-enabled" 
                  checked={settings.tradingEnabled}
                  onCheckedChange={(value) => handleSettingChange("tradingEnabled", value)}
                />
              </div>
              
              <div>
                <Label htmlFor="trade-amount">Trade Amount</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Slider 
                      id="trade-amount"
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      value={[settings.tradeAmount]}
                      onValueChange={(value) => handleSettingChange("tradeAmount", value[0])}
                    />
                  </div>
                  <div className="w-16">
                    <Input 
                      type="number" 
                      value={settings.tradeAmount} 
                      onChange={(e) => handleSettingChange("tradeAmount", parseFloat(e.target.value))}
                      min={0.1}
                      max={1.0}
                      step={0.1}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Percentage of your balance to trade
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buy-threshold">Buy Threshold</Label>
                  <Input 
                    id="buy-threshold" 
                    type="number" 
                    value={settings.buyThreshold}
                    onChange={(e) => handleSettingChange("buyThreshold", parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    % drop to trigger buy
                  </p>
                </div>
                <div>
                  <Label htmlFor="sell-threshold">Sell Threshold</Label>
                  <Input 
                    id="sell-threshold" 
                    type="number" 
                    value={settings.sellThreshold}
                    onChange={(e) => handleSettingChange("sellThreshold", parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    % rise to trigger sell
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                {!botRunning ? (
                  <Button 
                    onClick={handleStartBot}
                    disabled={isLoading || !selectedToken}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Bot
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStopBot}
                    variant="destructive"
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Stopping...
                      </>
                    ) : (
                      <>
                        <StopCircle className="w-4 h-4 mr-2" />
                        Stop Bot
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stop-loss">Stop Loss</Label>
                  <Input 
                    id="stop-loss" 
                    type="number" 
                    value={settings.stopLoss}
                    onChange={(e) => handleSettingChange("stopLoss", parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    % loss to exit trade
                  </p>
                </div>
                <div>
                  <Label htmlFor="take-profit">Take Profit</Label>
                  <Input 
                    id="take-profit" 
                    type="number" 
                    value={settings.takeProfit}
                    onChange={(e) => handleSettingChange("takeProfit", parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    % gain to exit trade
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="trailing-stop">Trailing Stop</Label>
                  <p className="text-sm text-muted-foreground">
                    Adjust stop loss as price moves
                  </p>
                </div>
                <Switch 
                  id="trailing-stop" 
                  checked={settings.trailingStop}
                  onCheckedChange={(value) => handleSettingChange("trailingStop", value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-rebalance">Auto-Rebalance</Label>
                  <p className="text-sm text-muted-foreground">
                    Rebalance portfolio automatically
                  </p>
                </div>
                <Switch 
                  id="auto-rebalance" 
                  checked={settings.autoRebalance}
                  onCheckedChange={(value) => handleSettingChange("autoRebalance", value)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary rounded-md mt-4">
                <div className="flex items-center">
                  <Flame className="h-5 w-5 text-orange-500 mr-2" />
                  <div>
                    <h4 className="font-medium">Turbo Mode</h4>
                    <p className="text-xs text-muted-foreground">
                      Higher frequency trading (Pro accounts only)
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" disabled>
                  Upgrade
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monitor">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Bot Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {botRunning ? "Running" : "Stopped"}
                  </p>
                </div>
                <div>
                  <div className={`h-3 w-3 rounded-full ${botRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                </div>
              </div>
              
              {botRunning && selectedToken && (
                <>
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                      <h3 className="font-medium">Active Trade</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Token</span>
                        <span className="font-medium">{tokenDetails?.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entry Price</span>
                        <span className="font-medium">$1.045</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Price</span>
                        <span className="font-medium text-green-500">$1.062 (+1.6%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stop Loss</span>
                        <span className="font-medium">$0.980</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Take Profit</span>
                        <span className="font-medium">$1.120</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Recent Bot Activity</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span>Bot started</span>
                        <span className="text-muted-foreground">Just now</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span>Analyzing market data</span>
                        <span className="text-muted-foreground">Just now</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Watching for trading opportunities</span>
                        <span className="text-muted-foreground">Just now</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {!botRunning && (
                <div className="flex flex-col items-center justify-center p-10 border rounded-md">
                  <Settings2 className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Bot is currently inactive</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Start the bot to begin automated trading and monitor your results here
                  </p>
                  <Button onClick={handleStartBot} disabled={!selectedToken || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Bot
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
