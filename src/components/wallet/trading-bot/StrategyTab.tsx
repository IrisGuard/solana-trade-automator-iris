
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TradingBotConfig } from "@/hooks/trading-bot/types";

interface StrategyTabProps {
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
}

export function StrategyTab({ config, updateConfig }: StrategyTabProps) {
  const handleChange = (key: keyof TradingBotConfig, value: any) => {
    updateConfig({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Παράμετροι Συναλλαγών</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="buyThreshold">Όριο Αγοράς (% πτώση)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  id="buyThreshold"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[config.buyThreshold]}
                  onValueChange={(value) => handleChange('buyThreshold', value[0])}
                  className="flex-1"
                />
                <div className="w-16">
                  <Input
                    type="number"
                    value={config.buyThreshold}
                    onChange={(e) => handleChange('buyThreshold', parseFloat(e.target.value))}
                    min={0.1}
                    max={10}
                    step={0.1}
                  />
                </div>
                <span className="text-sm font-medium">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ποσοστό πτώσης που θα ενεργοποιήσει μια εντολή αγοράς
              </p>
            </div>
            
            <div>
              <Label htmlFor="sellThreshold">Όριο Πώλησης (% ανόδου)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  id="sellThreshold"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[config.sellThreshold]}
                  onValueChange={(value) => handleChange('sellThreshold', value[0])}
                  className="flex-1"
                />
                <div className="w-16">
                  <Input
                    type="number"
                    value={config.sellThreshold}
                    onChange={(e) => handleChange('sellThreshold', parseFloat(e.target.value))}
                    min={0.1}
                    max={10}
                    step={0.1}
                  />
                </div>
                <span className="text-sm font-medium">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ποσοστό ανόδου που θα ενεργοποιήσει μια εντολή πώλησης
              </p>
            </div>
            
            <div className="pt-2">
              <Label htmlFor="tradeAmount">Ποσό Συναλλαγής (% του διαθέσιμου)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  id="tradeAmount"
                  min={1}
                  max={100}
                  step={1}
                  value={[config.tradeAmount]}
                  onValueChange={(value) => handleChange('tradeAmount', value[0])}
                  className="flex-1"
                />
                <div className="w-16">
                  <Input
                    type="number"
                    value={config.tradeAmount}
                    onChange={(e) => handleChange('tradeAmount', parseFloat(e.target.value))}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>
                <span className="text-sm font-medium">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ποσοστό του διαθέσιμου υπολοίπου που θα χρησιμοποιηθεί σε κάθε συναλλαγή
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Διαχείριση Ρίσκου</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="stopLoss">Stop Loss (%)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  id="stopLoss"
                  min={0.5}
                  max={20}
                  step={0.5}
                  value={[config.stopLoss]}
                  onValueChange={(value) => handleChange('stopLoss', value[0])}
                  className="flex-1"
                />
                <div className="w-16">
                  <Input
                    type="number"
                    value={config.stopLoss}
                    onChange={(e) => handleChange('stopLoss', parseFloat(e.target.value))}
                    min={0.5}
                    max={20}
                    step={0.5}
                  />
                </div>
                <span className="text-sm font-medium">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ποσοστό απώλειας που θα ενεργοποιήσει πώληση για περιορισμό ζημιάς
              </p>
            </div>
            
            <div>
              <Label htmlFor="takeProfit">Take Profit (%)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  id="takeProfit"
                  min={0.5}
                  max={20}
                  step={0.5}
                  value={[config.takeProfit]}
                  onValueChange={(value) => handleChange('takeProfit', value[0])}
                  className="flex-1"
                />
                <div className="w-16">
                  <Input
                    type="number"
                    value={config.takeProfit}
                    onChange={(e) => handleChange('takeProfit', parseFloat(e.target.value))}
                    min={0.5}
                    max={20}
                    step={0.5}
                  />
                </div>
                <span className="text-sm font-medium">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ποσοστό κέρδους που θα ενεργοποιήσει πώληση για κατοχύρωση κέρδους
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="trailingStop">Trailing Stop</Label>
                <p className="text-sm text-muted-foreground">
                  Προσαρμογή του stop loss καθώς αυξάνεται η τιμή
                </p>
              </div>
              <Switch
                id="trailingStop"
                checked={Boolean(config.trailingStop)}
                onCheckedChange={(checked) => handleChange('trailingStop', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoRebalance">Auto-Rebalance</Label>
                <p className="text-sm text-muted-foreground">
                  Αυτόματη ανακατανομή του χαρτοφυλακίου
                </p>
              </div>
              <Switch
                id="autoRebalance"
                checked={Boolean(config.autoRebalance)}
                onCheckedChange={(checked) => handleChange('autoRebalance', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
