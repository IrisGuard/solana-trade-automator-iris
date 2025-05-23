
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@solana/wallet-adapter-react";
import { MakerBotConfig, MakerBotStats, MakerBotService } from "@/services/bot/makerBotService";

export function MakerBotTab() {
  const { publicKey, connected } = useWallet();
  const [config, setConfig] = useState<MakerBotConfig | null>(null);
  const [stats, setStats] = useState<MakerBotStats | null>(null);
  const [botService, setBotService] = useState<MakerBotService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize bot when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toString();
      const service = new MakerBotService(walletAddress);
      
      setIsLoading(true);
      service.initialize().then(() => {
        setBotService(service);
        setConfig(service.getConfig());
        setStats(service.getStats());
        setIsLoading(false);
      });
    } else {
      setBotService(null);
      setConfig(null);
      setStats(null);
    }
  }, [connected, publicKey]);
  
  const updateConfig = (partialConfig: Partial<MakerBotConfig>) => {
    if (!botService) return;
    
    setIsLoading(true);
    botService.updateConfig(partialConfig).then(() => {
      setConfig(botService.getConfig());
      setIsLoading(false);
    });
  };
  
  const toggleBot = async () => {
    if (!botService) return;
    
    setIsLoading(true);
    if (botService.isRunning()) {
      await botService.stop();
    } else {
      await botService.start();
    }
    
    setStats(botService.getStats());
    setIsLoading(false);
  };
  
  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Maker Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please connect your wallet to use the maker bot</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!config || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Maker Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading bot configuration...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Market Maker Bot</CardTitle>
        <Badge variant={stats.status === 'active' ? 'default' : 'outline'}>
          {stats.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trading-pair">Trading Pair</Label>
              <Select
                value={config.tradingPair}
                onValueChange={value => updateConfig({ tradingPair: value })}
                disabled={isLoading || stats.status === 'active'}
              >
                <SelectTrigger id="trading-pair">
                  <SelectValue placeholder="Select trading pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL/USDC">SOL/USDC</SelectItem>
                  <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                  <SelectItem value="BONK/SOL">BONK/SOL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="order-size">Order Size</Label>
              <Input
                id="order-size"
                type="number"
                value={config.orderSize}
                onChange={e => updateConfig({ orderSize: parseFloat(e.target.value) })}
                disabled={isLoading || stats.status === 'active'}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Spread Target: {config.spreadTarget}%</Label>
            <Slider
              value={[config.spreadTarget]}
              onValueChange={value => updateConfig({ spreadTarget: value[0] })}
              min={0.05}
              max={1}
              step={0.05}
              disabled={isLoading || stats.status === 'active'}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.usePrivateRPC}
                onCheckedChange={checked => updateConfig({ usePrivateRPC: checked })}
                disabled={isLoading}
              />
              <Label>Use Private RPC</Label>
            </div>
          </div>
          
          <Button onClick={toggleBot} disabled={isLoading}>
            {isLoading ? 'Processing...' : stats.status === 'active' ? 'Stop Bot' : 'Start Bot'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
