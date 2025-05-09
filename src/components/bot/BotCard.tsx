
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface BotCardProps {
  botName: string;
  isActive: boolean;
  tokens: string[];
  profit: string;
  timeRunning: string;
  index: number;
}

export function BotCard({ botName, isActive, tokens, profit, timeRunning, index }: BotCardProps) {
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
}
