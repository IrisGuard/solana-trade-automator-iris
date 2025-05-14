
import React from "react";
import { Token } from "@/types/wallet";
import { Button } from "@/components/ui/button";
import { ChevronRight, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenItemProps {
  token: Token;
  price?: number;
  isSelected?: boolean;
  isLoading?: boolean;
  onSelect?: () => void;
  onTradingClick?: () => void;
}

export function TokenItem({ 
  token, 
  price, 
  isSelected = false,
  isLoading = false,
  onSelect,
  onTradingClick
}: TokenItemProps) {
  // Calculate token value if price is available
  const tokenValue = price ? Number(token.amount) * price : undefined;

  // Format token amount based on decimals
  const formatTokenAmount = (amount: number, decimals: number = 9) => {
    if (amount === 0) return '0';
    
    // For very small numbers, show more decimals
    if (amount < 0.001) {
      return amount.toFixed(6);
    }
    
    // For larger numbers, show fewer decimals
    return amount.toLocaleString(undefined, { 
      maximumFractionDigits: 4,
    });
  };
  
  // Format dollar value
  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg transition-colors",
        isSelected ? "bg-primary/10 border-primary" : "hover:bg-accent",
        isSelected ? "border" : "border border-transparent"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center">
          {token.logo ? (
            <img src={token.logo} alt={token.symbol} className="h-6 w-6" />
          ) : (
            <span className="text-xs font-medium">{token.symbol}</span>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-1">
            <p className="font-medium">{token.name}</p>
            <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
              {token.symbol}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {formatTokenAmount(token.amount, token.decimals)} {token.symbol}
            {tokenValue && (
              <span className="ml-1">
                ({formatUSD(tokenValue)})
              </span>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            onTradingClick?.();
          }}
        >
          <Bot className="h-4 w-4" />
          <span className="sr-only">Trading Bot</span>
        </Button>
        
        <ChevronRight className={cn(
          "h-5 w-5 text-muted-foreground transition-transform",
          isSelected ? "transform rotate-90" : ""
        )} />
      </div>
    </div>
  );
}
