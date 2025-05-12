
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SettingsTabProps {
  config: {
    selectedToken: string | null;
    tradeAmount: number;
    stopLossPercent: number;
    takeProfitPercent: number;
    maxTrades: number;
  };
  updateConfig: (newConfig: Partial<SettingsTabProps['config']>) => void;
  selectToken: (token: string | null) => void;
  selectedTokenPrice: { price: number; priceChange24h: number } | null;
  selectedTokenDetails: { amount: number; symbol: string } | null;
  tokens: { address: string; name: string; symbol: string }[];
}

export function SettingsTab({
  config,
  updateConfig,
  selectToken,
  selectedTokenPrice,
  selectedTokenDetails,
  tokens
}: SettingsTabProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
