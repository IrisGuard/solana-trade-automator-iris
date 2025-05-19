
import React from "react";
import { Input } from "@/components/ui/input";
import { TokenSelector } from "./TokenSelector";
import { Token } from "@/types/wallet";
import { TokenInfo } from "./types";

interface SwapInputPanelProps {
  label: string;
  tokens: Token[];
  tokenMint: string;
  amount: string;
  onTokenChange: (value: string) => void;
  onAmountChange?: (value: string) => void;
  disabled: boolean;
  readOnly?: boolean;
  excludeToken?: string;
  balance?: number;
  tokenInfo: TokenInfo;
}

export function SwapInputPanel({
  label,
  tokens,
  tokenMint,
  amount,
  onTokenChange,
  onAmountChange,
  disabled,
  readOnly = false,
  excludeToken,
  balance = 0,
  tokenInfo
}: SwapInputPanelProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <TokenSelector
          tokens={tokens}
          value={tokenMint}
          onChange={onTokenChange}
          disabled={disabled}
          excludeToken={excludeToken}
        />
        
        <Input
          type={readOnly ? "text" : "number"}
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange && onAmountChange(e.target.value)}
          disabled={disabled || readOnly}
          className={`flex-1 ${readOnly ? "bg-muted" : ""}`}
        />
      </div>
      
      <div className="text-xs text-muted-foreground">
        Balance: {balance} {tokenInfo.symbol}
      </div>
    </div>
  );
}
