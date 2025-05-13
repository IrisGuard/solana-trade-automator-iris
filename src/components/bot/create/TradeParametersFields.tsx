
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TradeParametersFieldsProps {
  maxTrade: string;
  setMaxTrade: (value: string) => void;
  takeProfit: string;
  setTakeProfit: (value: string) => void;
  stopLoss: string;
  setStopLoss: (value: string) => void;
}

export function TradeParametersFields({
  maxTrade,
  setMaxTrade,
  takeProfit,
  setTakeProfit,
  stopLoss,
  setStopLoss
}: TradeParametersFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="max-trade">Max Trade Size</Label>
        <Input 
          id="max-trade" 
          placeholder="0.5 SOL" 
          value={maxTrade}
          onChange={(e) => setMaxTrade(e.target.value)}
          suffix="SOL"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="take-profit">Take Profit (%)</Label>
        <Input 
          id="take-profit" 
          placeholder="3%" 
          value={takeProfit}
          onChange={(e) => setTakeProfit(e.target.value)}
          suffix="%"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stop-loss">Stop Loss (%)</Label>
        <Input 
          id="stop-loss" 
          placeholder="1.5%" 
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
          suffix="%"
        />
      </div>
    </>
  );
}
