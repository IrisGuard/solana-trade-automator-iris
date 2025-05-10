
import React from "react";
import { Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface BotSettingsProps {
  isSimulation: boolean;
  makers: number;
  minDelay: number;
  maxDelay: number;
  tokenAmount: number;
  solAmount: number;
  botActive: boolean;
  toggleSimulation: () => void;
  setMakers: (value: number) => void;
  setMinDelay: (value: number) => void;
  setMaxDelay: (value: number) => void;
  setTokenAmount: (value: number) => void;
  setSolAmount: (value: number) => void;
  handleStartBot: () => void;
  handleStopBot: () => void;
}

export function BotSettings({
  isSimulation,
  makers,
  minDelay,
  maxDelay,
  tokenAmount,
  solAmount,
  botActive,
  toggleSimulation,
  setMakers,
  setMinDelay,
  setMaxDelay,
  setTokenAmount,
  setSolAmount,
  handleStartBot,
  handleStopBot
}: BotSettingsProps) {
  return (
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
  );
}
