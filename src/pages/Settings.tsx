
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Solana Trader" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="trader@example.com" />
              </div>
              <Separator />
              <div>
                <h3 className="mb-4 text-lg font-medium">Security</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div />
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize your view preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable or disable dark mode
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact View</Label>
                  <div className="text-sm text-muted-foreground">
                    Show more information in less space
                  </div>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    <SelectItem value="est">EST (GMT-5)</SelectItem>
                    <SelectItem value="pst">PST (GMT-8)</SelectItem>
                    <SelectItem value="local">Use local timezone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Display Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="jpy">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API connections to exchanges and wallets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Solana RPC</h3>
                    <p className="text-sm text-muted-foreground">Connect to Solana blockchain</p>
                  </div>
                  <Badge status="connected" />
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="solana-rpc">RPC URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="solana-rpc"
                      type="text"
                      value="https://api.mainnet-beta.solana.com"
                      className="font-mono text-xs"
                      readOnly
                    />
                    <Button variant="outline" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c0-1.1.9-2 2-2h2"/><path d="M4 12c0-1.1.9-2 2-2h2"/><path d="M4 8c0-1.1.9-2 2-2h2"/></svg>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Jupiter API</h3>
                    <p className="text-sm text-muted-foreground">For token swaps and liquidity</p>
                  </div>
                  <Badge status="not-connected" />
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="jupiter-api">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="jupiter-api"
                      type="password"
                      placeholder="Enter your Jupiter API key"
                    />
                    <Button>Connect</Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Trading View</h3>
                    <p className="text-sm text-muted-foreground">For technical analysis and charts</p>
                  </div>
                  <Badge status="not-connected" />
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="tradingview-api">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tradingview-api"
                      type="password"
                      placeholder="Enter your TradingView API key"
                    />
                    <Button>Connect</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connected Wallets</CardTitle>
              <CardDescription>
                Manage wallets connected to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Phantom Wallet</h3>
                    <p className="text-xs text-muted-foreground">3eDZ...f9Kt</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Disconnect
                </Button>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <Button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Connect New Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Trading Notifications</h3>
              
              <div className="space-y-4">
                <NotificationSetting
                  title="Trade Execution"
                  description="Receive notifications when bots execute trades"
                  defaultChecked={true}
                />
                
                <NotificationSetting
                  title="Order Filled"
                  description="Receive notifications when orders are filled"
                  defaultChecked={true}
                />
                
                <NotificationSetting
                  title="Order Cancelled"
                  description="Receive notifications when orders are cancelled"
                  defaultChecked={false}
                />
                
                <NotificationSetting
                  title="Price Alerts"
                  description="Receive notifications for price movements"
                  defaultChecked={true}
                />
                
                <Separator />
                
                <h3 className="font-medium">System Notifications</h3>
                
                <NotificationSetting
                  title="Bot Status"
                  description="Receive notifications when bot status changes"
                  defaultChecked={true}
                />
                
                <NotificationSetting
                  title="Performance Reports"
                  description="Receive daily performance reports"
                  defaultChecked={false}
                />
                
                <NotificationSetting
                  title="Security Alerts"
                  description="Receive notifications for security events"
                  defaultChecked={true}
                />
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="notification-channel">Notification Channel</Label>
                  <Select defaultValue="both">
                    <SelectTrigger id="notification-channel">
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Email and Browser</SelectItem>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="browser">Browser Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bot Trading Settings</CardTitle>
              <CardDescription>
                Configure advanced settings for your trading bots
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="mb-4 flex items-center gap-2 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z"/></svg>
                  <span className="text-sm font-medium">Changing these settings may impact bot performance</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Concurrent Trades</Label>
                      <div className="text-sm text-muted-foreground">
                        Allow bots to execute multiple trades simultaneously
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-trades">Maximum Concurrent Trades</Label>
                    <Select defaultValue="3">
                      <SelectTrigger id="max-trades">
                        <SelectValue placeholder="Select maximum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Risk Management</Label>
                      <div className="text-sm text-muted-foreground">
                        Automatically adjust risk based on portfolio performance
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-drawdown">Maximum Allowed Drawdown</Label>
                    <Select defaultValue="10">
                      <SelectTrigger id="max-drawdown">
                        <SelectValue placeholder="Select percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="15">15%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Emergency Stop</Label>
                      <div className="text-sm text-muted-foreground">
                        Automatically stop all bots on significant market events
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="volatility-threshold">Volatility Threshold</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="volatility-threshold">
                        <SelectValue placeholder="Select threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (5% movements)</SelectItem>
                        <SelectItem value="medium">Medium (10% movements)</SelectItem>
                        <SelectItem value="high">High (20% movements)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-secondary/50 p-4">
                <h3 className="mb-4 font-medium">Data Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Use High-Performance RPC</Label>
                      <div className="text-sm text-muted-foreground">
                        Use dedicated RPC endpoints for faster data
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-source">Primary Data Source</Label>
                    <Select defaultValue="birdeye">
                      <SelectTrigger id="data-source">
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="birdeye">Birdeye</SelectItem>
                        <SelectItem value="coingecko">CoinGecko</SelectItem>
                        <SelectItem value="tradingview">TradingView</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Cache</Label>
                      <div className="text-sm text-muted-foreground">
                        Cache data to reduce API calls
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Advanced Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Actions that can't be undone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                <h3 className="font-medium text-destructive">Reset Application</h3>
                <p className="mt-1 text-sm">
                  This will reset all settings and data. This action cannot be undone.
                </p>
                <div className="mt-4">
                  <Button variant="destructive">Reset Application</Button>
                </div>
              </div>
              
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                <h3 className="font-medium text-destructive">Delete Account</h3>
                <p className="mt-1 text-sm">
                  Permanently delete your account and all associated data.
                </p>
                <div className="mt-4">
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BadgeProps {
  status: 'connected' | 'not-connected';
}

const Badge = ({ status }: BadgeProps) => {
  return (
    <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
      status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'
    }`}>
      <div className={`h-1.5 w-1.5 rounded-full ${
        status === 'connected' ? 'bg-green-400' : 'bg-muted-foreground'
      }`} />
      {status === 'connected' ? 'Connected' : 'Not Connected'}
    </div>
  );
};

interface NotificationSettingProps {
  title: string;
  description: string;
  defaultChecked: boolean;
}

const NotificationSetting = ({ title, description, defaultChecked }: NotificationSettingProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{title}</Label>
        <div className="text-sm text-muted-foreground">
          {description}
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
};
