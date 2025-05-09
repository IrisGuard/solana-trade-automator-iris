
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowUpRight, QrCode, Wallet, Zap, AlertTriangle, Shield, Database, Key } from "lucide-react";

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
  const [apiKeys, setApiKeys] = useState([
    { name: "Jupiter API", connected: false },
    { name: "Solana RPC", connected: true },
    { name: "Exchange API", connected: false }
  ]);
  const [botRunningTime, setBotRunningTime] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [apiSettings, setApiSettings] = useState({
    rpcUrl: "https://api.mainnet-beta.solana.com",
    customRpc: false,
    fallbackRpc: true,
    rateLimit: 10
  });

  const walletAddress = "3eDZ...f9Kt";
  const solBalance = 12.45;
  const tokenBalance = 250000;

  // Προσομοίωση χρόνου λειτουργίας του bot
  useEffect(() => {
    let timer: number;
    if (botActive) {
      timer = window.setInterval(() => {
        setBotRunningTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [botActive]);

  // Μορφοποίηση χρόνου λειτουργίας
  const formatRunningTime = () => {
    const hours = Math.floor(botRunningTime / 3600);
    const minutes = Math.floor((botRunningTime % 3600) / 60);
    const seconds = botRunningTime % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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
      setBotRunningTime(0);
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

  const handleApiConnect = (index: number) => {
    const updatedKeys = [...apiKeys];
    updatedKeys[index].connected = !updatedKeys[index].connected;
    setApiKeys(updatedKeys);
    
    if (updatedKeys[index].connected) {
      toast.success(`${updatedKeys[index].name} connected successfully`);
    } else {
      toast.info(`${updatedKeys[index].name} disconnected`);
    }
  };

  const handleUnlockVault = () => {
    setIsUnlocked(true);
    toast.success("API vault unlocked");
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    toast.info("API vault locked");
  };

  const handleSaveApiSettings = () => {
    toast.success("API settings saved successfully");
  };

  const handleExportKeys = () => {
    toast.success("API keys exported (encrypted)");
  };

  const handleImportKeys = () => {
    toast.success("API keys imported successfully");
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
          <TabsTrigger value="api-vault">API Vault</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
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
                  {botActive && <p>Running for: {formatRunningTime()}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>API Status</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {apiKeys.filter(key => key.connected).length}/{apiKeys.length} Connected
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

                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-white text-xs">USDC</span>
                      </div>
                      <div>
                        <p className="font-medium">USD Coin</p>
                        <p className="text-sm text-muted-foreground">USDC</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">1,532.25 USDC</p>
                      <p className="text-sm text-muted-foreground">≈ $1,532.25</p>
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
                  {[
                    { type: "Transfer", time: new Date(Date.now() - 1 * 3600000), amount: "+0.1 SOL", to: "4fY2..sD8j" },
                    { type: "Swap", time: new Date(Date.now() - 5 * 3600000), amount: "-10 USDC", to: "0.05 SOL" },
                    { type: "Transfer", time: new Date(Date.now() - 12 * 3600000), amount: "-0.2 SOL", to: "8hK3..j2Lm" }
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{tx.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.time.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.amount.startsWith('+') ? 'text-green-400' : ''}`}>{tx.amount}</p>
                        <p className="text-sm text-muted-foreground">{tx.type === "Swap" ? "For: " : "To: "}{tx.to}</p>
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

        <TabsContent value="api-vault" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                API Key Vault
              </CardTitle>
              <CardDescription>
                Securely store and manage your API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isUnlocked ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Key className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">API Vault is Locked</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Unlock the vault to manage your API keys and secrets
                  </p>
                  <Button onClick={handleUnlockVault}>
                    Unlock Vault
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Stored API Keys</h3>
                    <Button variant="outline" size="sm" onClick={handleLockVault}>
                      Lock Vault
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {apiKeys.map((api, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                            api.connected ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Database className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{api.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {api.connected ? 'Active' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant={api.connected ? 'outline' : 'default'} 
                          size="sm"
                          onClick={() => handleApiConnect(index)}
                        >
                          {api.connected ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={handleExportKeys}>
                      Export Keys
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleImportKeys}>
                      Import Keys
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Connection Settings</CardTitle>
              <CardDescription>Configure RPC and API endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rpc-url">Solana RPC URL</Label>
                <Input 
                  id="rpc-url" 
                  value={apiSettings.rpcUrl}
                  onChange={(e) => setApiSettings({...apiSettings, rpcUrl: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="custom-rpc"
                  checked={apiSettings.customRpc}
                  onCheckedChange={(checked) => setApiSettings({...apiSettings, customRpc: checked})}
                />
                <Label htmlFor="custom-rpc">Use custom RPC endpoint</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="fallback-rpc"
                  checked={apiSettings.fallbackRpc}
                  onCheckedChange={(checked) => setApiSettings({...apiSettings, fallbackRpc: checked})}
                />
                <Label htmlFor="fallback-rpc">Enable RPC fallback</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rate-limit">Rate limit (requests/sec): {apiSettings.rateLimit}</Label>
                <Slider 
                  id="rate-limit"
                  min={1} 
                  max={20} 
                  step={1}
                  value={[apiSettings.rateLimit]}
                  onValueChange={(values) => setApiSettings({...apiSettings, rateLimit: values[0]})}
                />
              </div>
              
              <Button className="w-full" onClick={handleSaveApiSettings}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

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
      </Tabs>
    </div>
  );
}
