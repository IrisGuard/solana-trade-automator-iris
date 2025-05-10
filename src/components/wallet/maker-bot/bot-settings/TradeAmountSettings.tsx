
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TradeAmountSettingsProps {
  tokenAmount: number;
  solAmount: number;
  setTokenAmount: (value: number) => void;
  setSolAmount: (value: number) => void;
  disabled: boolean;
}

export function TradeAmountSettings({
  tokenAmount,
  solAmount,
  setTokenAmount,
  setSolAmount,
  disabled
}: TradeAmountSettingsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="token-amount">Tokens Per Trade: {tokenAmount}</Label>
        <Input 
          id="token-amount" 
          type="number" 
          value={tokenAmount} 
          onChange={(e) => setTokenAmount(Number(e.target.value))}
          disabled={disabled}
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
          disabled={disabled}
        />
      </div>
    </>
  );
}
