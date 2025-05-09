
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";

interface MakerBotTabProps {
  isConnected: boolean;
  isSimulation: boolean;
  makers: number;
  minDelay: number;
  maxDelay: number;
  priceBoost: number;
  botActive: boolean;
  tokenAmount: number;
  solAmount: number;
  handleConnectWallet: () => void;
  toggleSimulation: () => void;
  setMakers: (value: number) => void;
  setMinDelay: (value: number) => void;
  setMaxDelay: (value: number) => void;
  setPriceBoost: (value: number) => void;
  setTokenAmount: (value: number) => void;
  setSolAmount: (value: number) => void;
  handleStartBot: () => void;
  handleStopBot: () => void;
  handleBoostPrice: () => void;
}

export function MakerBotTab({
  isConnected,
  isSimulation,
  makers,
  minDelay,
  maxDelay,
  priceBoost,
  botActive,
  tokenAmount,
  solAmount,
  handleConnectWallet,
  toggleSimulation,
  setMakers,
  setMinDelay,
  setMaxDelay,
  setPriceBoost,
  setTokenAmount,
  setSolAmount,
  handleStartBot,
  handleStopBot,
  handleBoostPrice
}: MakerBotTabProps) {
  return (
    <TabsContent value="maker-bot" className="space-y-4">
      {isConnected ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Maker Bot Settings
              </CardTitle>
              <CardDescription>Configure trading parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Simulation Mode</Label>
                    <p className="text-sm text-muted-foreground">No real trades when enabled</p>
                  </div>
                  <Switch checked={isSimulation} onCheckedChange={toggleSimulation} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="makers-count">Number of Makers: {makers}</Label>
                  <Slider 
                    id="makers-count"
                    min={10} 
                    max={500} 
                    step={10}
                    value={[makers]}
                    onValueChange={(values) => setMakers(values[0])}
                    disabled={botActive}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-delay">Min Delay (sec): {minDelay}</Label>
                    <Slider 
                      id="min-delay"
                      min={1} 
                      max={30} 
                      value={[minDelay]}
                      onValueChange={(values) => setMinDelay(values[0])}
                      disabled={botActive}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-delay">Max Delay (sec): {maxDelay}</Label>
                    <Slider 
                      id="max-delay"
                      min={1} 
                      max={60} 
                      value={[maxDelay]}
                      onValueChange={(values) => setMaxDelay(values[0])}
                      disabled={botActive}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token-amount">Tokens Per Trade: {tokenAmount}</Label>
                  <Input 
                    id="token-amount" 
                    type="number" 
                    value={tokenAmount} 
                    onChange={(e) => setTokenAmount(Number(e.target.value))}
                    disabled={botActive}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sol-amount">SOL Required: {solAmount}</Label>
                  <Input 
                    id="sol-amount" 
                    type="number" 
                    step="0.01"
                    value={solAmount} 
                    onChange={(e) => setSolAmount(Number(e.target.value))}
                    disabled={botActive}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exchange-select">Target DEX</Label>
                  <Select disabled={botActive}>
                    <SelectTrigger id="exchange-select">
                      <SelectValue placeholder="Jupiter Aggregator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jupiter">Jupiter Aggregator</SelectItem>
                      <SelectItem value="orca">Orca</SelectItem>
                      <SelectItem value="raydium">Raydium</SelectItem>
                      <SelectItem value="openbook">OpenBook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {botActive ? (
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleStopBot}
                  >
                    Stop Bot
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={handleStartBot}
                  >
                    Start Bot
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price Boosting</CardTitle>
              <CardDescription>Manually boost token price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price-boost">Price Boost (%): {priceBoost}%</Label>
                <Slider 
                  id="price-boost"
                  min={0} 
                  max={50} 
                  step={1}
                  value={[priceBoost]}
                  onValueChange={(values) => setPriceBoost(values[0])}
                  disabled={!isConnected}
                />
              </div>

              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handleBoostPrice}
                disabled={!isConnected || priceBoost === 0}
              >
                Boost Price Now
              </Button>

              <div className="pt-4 space-y-3 border-t">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Performance</Label>
                    <span className="text-sm text-green-500">+2.5%</span>
                  </div>
                  <Progress value={52} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Bot Activity</Label>
                    <span className="text-xs text-muted-foreground">
                      {botActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <Progress value={botActive ? 78 : 0} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>API Health</Label>
                    <span className="text-xs text-muted-foreground">3/5 Endpoints</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>

              <div className="pt-4 space-y-3 border-t">
                <h4 className="font-semibold">Bot Statistics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Trades Executed:</div>
                  <div className="text-right">152</div>
                  <div>Volume Generated:</div>
                  <div className="text-right">2.5K TOKEN</div>
                  <div>Success Rate:</div>
                  <div className="text-right">98.7%</div>
                  <div>Price Impact:</div>
                  <div className="text-right text-green-500">+5.2%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Connect Wallet to Use Maker Bot</CardTitle>
            <CardDescription>You need to connect your wallet to use the trading bot</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button onClick={handleConnectWallet}>Connect Wallet</Button>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}
