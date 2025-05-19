
import React from "react";
import { SwapQuoteProps } from "./types";

export function SwapQuote({ inputToken, outputToken, outputAmount, inputAmount, priceImpact }: SwapQuoteProps) {
  return (
    <div className="bg-muted p-3 rounded-md">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Rate</span>
        <span>
          1 {inputToken.symbol} ≈ {
            (Number(outputAmount) / Number(inputAmount)).toFixed(6)
          } {outputToken.symbol}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Price Impact</span>
        <span>{priceImpact}</span>
      </div>
    </div>
  );
}
