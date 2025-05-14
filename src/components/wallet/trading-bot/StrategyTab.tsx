
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TradingBotConfig } from "@/hooks/trading-bot/types";

interface StrategyTabProps {
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
}

export function StrategyTab({
  config,
  updateConfig
}: StrategyTabProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Στρατηγική</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="buy-threshold">Όριο Αγοράς ({config.buyThreshold}%)</Label>
            <Slider 
              id="buy-threshold"
              value={[config.buyThreshold]} 
              min={1} 
              max={10} 
              step={0.5}
              onValueChange={(value) => updateConfig({ buyThreshold: value[0] })}
            />
            <p className="text-xs text-muted-foreground">
              Αγορά όταν η τιμή πέσει κάτω από {config.buyThreshold}% από την τελευταία αγορά
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sell-threshold">Όριο Πώλησης ({config.sellThreshold}%)</Label>
            <Slider 
              id="sell-threshold"
              value={[config.sellThreshold]} 
              min={1} 
              max={20} 
              step={0.5}
              onValueChange={(value) => updateConfig({ sellThreshold: value[0] })}
            />
            <p className="text-xs text-muted-foreground">
              Πώληση όταν η τιμή ανέβει πάνω από {config.sellThreshold}% από την τελευταία αγορά
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stop-loss">Stop Loss ({config.stopLoss}%)</Label>
            <Slider 
              id="stop-loss"
              value={[config.stopLoss]} 
              min={1} 
              max={20} 
              step={0.5}
              onValueChange={(value) => updateConfig({ stopLoss: value[0] })}
            />
            <p className="text-xs text-muted-foreground">
              Αυτόματη πώληση όταν η τιμή πέσει κάτω από {config.stopLoss}% από την τιμή αγοράς
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="take-profit">Take Profit ({config.takeProfit}%)</Label>
            <Slider 
              id="take-profit"
              value={[config.takeProfit]} 
              min={1} 
              max={50} 
              step={0.5}
              onValueChange={(value) => updateConfig({ takeProfit: value[0] })}
            />
            <p className="text-xs text-muted-foreground">
              Αυτόματη πώληση όταν η τιμή ανέβει πάνω από {config.takeProfit}% από την τιμή αγοράς
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trade-amount">Ποσό Συναλλαγής ({config.tradeAmount})</Label>
            <Slider 
              id="trade-amount"
              value={[config.tradeAmount]} 
              min={1} 
              max={100} 
              step={1}
              onValueChange={(value) => updateConfig({ tradeAmount: value[0] })}
            />
            <p className="text-xs text-muted-foreground">
              Ποσό για κάθε συναλλαγή
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-budget">Μέγιστο Όριο ($) ({config.maxBudget})</Label>
            <Slider 
              id="max-budget"
              value={[config.maxBudget]} 
              min={10} 
              max={500} 
              step={10}
              onValueChange={(value) => updateConfig({ maxBudget: value[0] })}
            />
            <p className="text-xs text-muted-foreground">
              Μέγιστο ποσό που μπορεί να χρησιμοποιήσει το bot
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <Label htmlFor="trailing-stop">Trailing Stop</Label>
              <p className="text-xs text-muted-foreground">
                Προσαρμογή του stop loss όταν η τιμή ανεβαίνει
              </p>
            </div>
            <Switch 
              id="trailing-stop"
              checked={config.trailingStop}
              onCheckedChange={(value) => updateConfig({ trailingStop: value })}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <Label htmlFor="auto-rebalance">Αυτόματη Επανεξισορρόπηση</Label>
              <p className="text-xs text-muted-foreground">
                Αυτόματη ρύθμιση παραμέτρων με βάση την απόδοση
              </p>
            </div>
            <Switch 
              id="auto-rebalance"
              checked={config.autoRebalance}
              onCheckedChange={(value) => updateConfig({ autoRebalance: value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
