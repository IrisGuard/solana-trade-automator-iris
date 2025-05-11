import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";
import { useTradingBot } from "@/hooks/useTradingBot";
import { Loader, AlertCircle, Wallet, TrendingUp, ArrowUpDown, Check } from "lucide-react";
import { tradingService } from "@/services/solana/tradingService";

export function TradingBotTab() {
  const {
    config,
    updateConfig,
    startBot,
    stopBot,
    selectToken,
    isLoading,
    botStatus,
    activeOrders,
    selectedTokenPrice,
    selectedTokenDetails,
    connected,
    tokens
  } = useTradingBot();
  
  const [tab, setTab] = useState("settings");
  
  // Handle connect wallet
  const handleConnectWallet = () => {
    // This is handled by the WalletMultiButton component
  };
  
  if (!connected) {
    return (
      <TabsContent value="trading-bot" className="space-y-4">
        <ConnectPrompt 
          handleConnectWallet={handleConnectWallet} 
          size="large"
        />
      </TabsContent>
    );
  }
  
  return (
    <TabsContent value="trading-bot" className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Trading Bot</span>
              {botStatus === 'running' && (
                <div className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded border border-green-200">
                  Ενεργό
                </div>
              )}
            </CardTitle>
            <CardDescription>Αυτοματοποιημένο trading με stop-loss και take-profit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="settings">Ρυθμίσεις</TabsTrigger>
                <TabsTrigger value="orders">Εντολές</TabsTrigger>
                <TabsTrigger value="history">Ιστορικό</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="space-y-4">
                {/* Token Selection */}
                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <Select 
                    value={config.selectedToken || ""} 
                    onValueChange={(value) => selectToken(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Επιλέξτε token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                          {token.name} ({token.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTokenDetails && selectedTokenPrice && (
                    <div className="mt-2 text-sm bg-muted p-2 rounded">
                      <div className="flex justify-between items-center">
                        <span>Τρέχουσα τιμή:</span>
                        <span className="font-medium">${selectedTokenPrice.price.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Διαθέσιμο:</span>
                        <span className="font-medium">{selectedTokenDetails.amount} {selectedTokenDetails.symbol}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Trade Amount */}
                <div className="space-y-2">
                  <Label htmlFor="tradeAmount">Ποσό συναλλαγής (SOL)</Label>
                  <Input 
                    id="tradeAmount"
                    type="number" 
                    value={config.tradeAmount}
                    onChange={(e) => updateConfig({ tradeAmount: parseFloat(e.target.value) })}
                    min={0.01}
                    step={0.01}
                  />
                </div>
                
                {/* Stop Loss */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                    <span className="text-sm font-medium">{config.stopLossPercent}%</span>
                  </div>
                  <Slider 
                    value={[config.stopLossPercent]}
                    min={1}
                    max={20}
                    step={0.5}
                    onValueChange={([value]) => updateConfig({ stopLossPercent: value })}
                  />
                  {selectedTokenPrice && (
                    <div className="text-sm text-muted-foreground">
                      Τιμή ενεργοποίησης: ${(selectedTokenPrice.price * (1 - (config.stopLossPercent / 100))).toFixed(4)}
                    </div>
                  )}
                </div>
                
                {/* Take Profit */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="takeProfit">Take Profit (%)</Label>
                    <span className="text-sm font-medium">{config.takeProfitPercent}%</span>
                  </div>
                  <Slider 
                    value={[config.takeProfitPercent]}
                    min={1}
                    max={50}
                    step={0.5}
                    onValueChange={([value]) => updateConfig({ takeProfitPercent: value })}
                  />
                  {selectedTokenPrice && (
                    <div className="text-sm text-muted-foreground">
                      Τιμή ενεργοποίησης: ${(selectedTokenPrice.price * (1 + (config.takeProfitPercent / 100))).toFixed(4)}
                    </div>
                  )}
                </div>
                
                {/* Max Trades */}
                <div className="space-y-2">
                  <Label htmlFor="maxTrades">Μέγιστος αριθμός συναλλαγών</Label>
                  <Input 
                    id="maxTrades"
                    type="number" 
                    value={config.maxTrades}
                    onChange={(e) => updateConfig({ maxTrades: parseInt(e.target.value) })}
                    min={1}
                    max={20}
                  />
                </div>
                
                {!config.selectedToken && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Επιλέξτε ένα token για να ρυθμίσετε το trading bot
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="orders">
                {activeOrders.length > 0 ? (
                  <div className="space-y-3">
                    {activeOrders.map((order) => (
                      <div key={order.id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <div className="font-medium">{order.type === 'stop-loss' ? 'Stop Loss' : 'Take Profit'}</div>
                          <div className="text-sm text-muted-foreground">
                            Τιμή: ${order.price.toFixed(4)} • Ποσό: {order.amount} SOL
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => tradingService.cancelOrder(order.id)}>
                          Ακύρωση
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <ArrowUpDown className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p>Δεν υπάρχουν ενεργές εντολές</p>
                    <p className="text-sm mt-1">Ξεκινήστε το bot για να δημιουργηθούν εντολές</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history">
                <div className="py-8 text-center text-muted-foreground">
                  <p>Δεν υπάρχουν ιστορικές συναλλαγές</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            {botStatus === 'running' ? (
              <Button 
                variant="destructive" 
                onClick={stopBot}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                Διακοπή Bot
              </Button>
            ) : (
              <Button 
                variant="default" 
                onClick={startBot}
                disabled={isLoading || !config.selectedToken}
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                Εκκίνηση Bot
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Κατάσταση</CardTitle>
            <CardDescription>Πληροφορίες για το trading bot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Κατάσταση:</span>
                <span className={`text-sm font-medium ${
                  botStatus === 'running' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {botStatus === 'running' ? 'Ενεργό' : 'Ανενεργό'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Επιλεγμένο token:</span>
                <span className="text-sm font-medium">
                  {selectedTokenDetails ? `${selectedTokenDetails.symbol}` : '-'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Τρέχουσα τιμή:</span>
                <span className="text-sm font-medium">
                  {selectedTokenPrice ? `$${selectedTokenPrice.price.toFixed(4)}` : '-'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">24ωρη μεταβολή:</span>
                <span className={`text-sm font-medium ${
                  selectedTokenPrice && selectedTokenPrice.priceChange24h >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {selectedTokenPrice 
                    ? `${selectedTokenPrice.priceChange24h >= 0 ? '+' : ''}${selectedTokenPrice.priceChange24h.toFixed(2)}%` 
                    : '-'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ενεργές εντολές:</span>
                <span className="text-sm font-medium">{activeOrders.length}</span>
              </div>
            </div>
            
            {botStatus === 'running' && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Το trading bot λειτουργεί κανονικά και παρακολουθεί τις τιμές.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
