
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TokenSelectionFieldsProps {
  baseToken: string;
  setBaseToken: (value: string) => void;
  quoteToken: string;
  setQuoteToken: (value: string) => void;
}

export function TokenSelectionFields({
  baseToken,
  setBaseToken,
  quoteToken,
  setQuoteToken
}: TokenSelectionFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="base-token">Base Token</Label>
        <Select value={baseToken} onValueChange={setBaseToken}>
          <SelectTrigger id="base-token">
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sol">SOL</SelectItem>
            <SelectItem value="btc">BTC</SelectItem>
            <SelectItem value="eth">ETH</SelectItem>
            <SelectItem value="ray">RAY</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quote-token">Quote Token</Label>
        <Select value={quoteToken} onValueChange={setQuoteToken}>
          <SelectTrigger id="quote-token">
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usdc">USDC</SelectItem>
            <SelectItem value="usdt">USDT</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
