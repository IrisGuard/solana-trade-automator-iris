
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface BotCardSettingsProps {
  index: number;
}

export function BotCardSettings({ index }: BotCardSettingsProps) {
  return (
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
  );
}
