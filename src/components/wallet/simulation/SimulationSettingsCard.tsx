
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function SimulationSettingsCard() {
  return (
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
  );
}
