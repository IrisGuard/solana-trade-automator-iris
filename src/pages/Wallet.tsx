
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowUpRight, QrCode, Wallet, Zap } from "lucide-react";

export default function WalletPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulation, setIsSimulation] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [makers, setMakers] = useState(100);
  const [minDelay, setMinDelay] = useState(5);
  const [maxDelay, setMaxDelay] = useState(10);
  const [priceBoost, setPriceBoost] = useState(0);
  const [botActive, setBotActive] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(100000);
  const [solAmount, setSolAmount] = useState(0.5);

  const walletAddress = "3eDZ...f9Kt";
  const solBalance = 12.45;
  const tokenBalance = 250000;

  const handleConnectWallet = () => {
    setIsConnected(true);
    toast.success("Wallet connected successfully");
  };

  const handleDisconnectWallet = () => {
    setIsConnected(false);
    setBotActive(false);
    toast.info("Wallet disconnected");
  };

  const toggleSimulation = () => {
    setIsSimulation(!isSimulation);
    toast.info(isSimulation ? "Live trading enabled" : "Simulation mode enabled");
  };

  const handleStartBot = () => {
    if (isConnected) {
      setBotActive(true);
      toast.success(
        isSimulation 
          ? "Bot started in simulation mode" 
          : "Bot started with live trading"
      );
    } else {
      toast.error("Please connect your wallet first");
    }
  };

  const handleStopBot = () => {
    setBotActive(false);
    toast.info("Bot stopped");
  };

  const handleBoostPrice = () => {
    if (priceBoost > 0) {
      toast.success(`Boosting price by ${priceBoost}%`);
    } else {
      toast.error("Please set a price boost percentage first");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Wallet & Maker Bot</h2>
        {isConnected ? (
          <Button variant="outline" onClick={handleDisconnectWallet}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={handleConnectWallet}>
            Connect Wallet
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="maker-bot">Maker Bot</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Wallet Status</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {isConnected ? "Connected" : "Not Connected"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isConnected && (
                  <div className="text-sm text-muted-foreground">
                    <p>Address: {walletAddress}</p>
                    <p>Balance: {solBalance} SOL</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Maker Bot Status</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {botActive ? "Active" : "Inactive"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Mode: {isSimulation ? "Simulation" : "Live Trading"}</p>
                  {botActive && <p>Running for: 00:45:32</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>API Status</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  3/5 Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Connected to Solana Mainnet</p>
                  <p>Last sync: 1 min ago</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {isConnected && (
            <Card>
              <CardHeader>
                <CardTitle>Wallet QR Code</CardTitle>
                <CardDescription>Scan to send SOL or tokens</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="border border-border p-4 rounded-lg">
                  <QrCode size={200} />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Token Balance</CardTitle>
                  <CardDescription>Your Solana SPL tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-primary-foreground">SOL</span>
                      </div>
                      <div>
                        <p className="font-medium">Solana</p>
                        <p className="text-sm text-muted-foreground">SOL</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{solBalance} SOL</p>
                      <p className="text-sm text-muted-foreground">≈ $1,245.00</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-white text-xs">TOKEN</span>
                      </div>
                      <div>
                        <p className="font-medium">Your Token</p>
                        <p className="text-sm text-muted-foreground">TOKEN</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{tokenBalance} TOKEN</p>
                      <p className="text-sm text-muted-foreground">≈ $2,500.00</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Add New Token
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest transactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">Transfer</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Date.now() - i * 3600000).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{i === 1 ? '+' : '-'}{0.1 * i} SOL</p>
                        <p className="text-sm text-muted-foreground">To: 4fY2..sD8j</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Connect Wallet to View Tokens</CardTitle>
                <CardDescription>You need to connect your wallet to manage your tokens</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Button onClick={handleConnectWallet}>Connect Wallet</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

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
      </Tabs>
    </div>
  );
}
