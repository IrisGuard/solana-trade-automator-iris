
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PriceBoostProps {
  isConnected: boolean;
  priceBoost: number;
  botActive: boolean;
  setPriceBoost: (value: number) => void;
  handleBoostPrice: () => void;
}

export function PriceBoost({
  isConnected,
  priceBoost,
  botActive,
  setPriceBoost,
  handleBoostPrice
}: PriceBoostProps) {
  return (
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

        <BotPerformance botActive={botActive} />
        <BotStatistics />
      </CardContent>
    </Card>
  );
}

function BotPerformance({ botActive }: { botActive: boolean }) {
  return (
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
  );
}

function BotStatistics() {
  return (
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
  );
}
