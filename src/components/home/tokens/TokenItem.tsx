import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, TrendingUp, TrendingDown, Loader } from "lucide-react";
import { Token } from "@/types/wallet";

interface TokenItemProps {
  token: Token;
  selectedToken: string | null;
  tokenPrice?: number;
  isLoading?: boolean;
  onSelectToken: (tokenAddress: string) => void;
  onTradingClick: (tokenAddress: string) => void;
}

export function TokenItem({ 
  token, 
  selectedToken, 
  tokenPrice, 
  isLoading, 
  onSelectToken, 
  onTradingClick 
}: TokenItemProps) {
  // Determine if this token is selected
  const isSelected = selectedToken === token.address;
  
  // Get a pseudo-random trend (in a real app, this would be based on actual data)
  const isPositiveTrend = Math.random() > 0.5;
  
  // Calculate token value if we have price data
  const tokenValue = tokenPrice ? token.amount * tokenPrice : null;
  
  // Format number with appropriate decimals
  const formatNumber = (num: number, maxDecimals: number = 6) => {
    // For large numbers, limit decimals
    if (num >= 1000) {
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    // For small numbers, keep more decimals
    else {
      return num.toLocaleString(undefined, { maximumFractionDigits: maxDecimals });
    }
  };

  return (
    <div 
      className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'} cursor-pointer border-b last:border-0 last:pb-0`}
      onClick={() => onSelectToken(token.address)}
    >
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center overflow-hidden">
          {token.logo ? (
            <img src={token.logo} alt={token.symbol} className="h-8 w-8" />
          ) : (
            <span className="text-primary-foreground text-xs font-bold">{token.symbol.slice(0, 3)}</span>
          )}
        </div>
        <div>
          <p className="font-medium">{token.name}</p>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">{token.symbol}</span>
            {isPositiveTrend ? (
              <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 ml-1 text-red-500" />
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{formatNumber(token.amount)} {token.symbol}</p>
        {tokenValue && (
          <p className="text-xs text-muted-foreground">
            ≈ ${formatNumber(tokenValue, 2)}
          </p>
        )}
        <div className="flex items-center gap-1 justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs" 
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://solscan.io/token/${token.address}`, '_blank');
            }}
          >
            Προβολή <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
          {isSelected && (
            <Button 
              size="sm" 
              className="h-6 px-2 text-xs"
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                onTradingClick(token.address);
              }}
            >
              {isLoading ? (
                <>
                  <Loader className="h-3 w-3 mr-1 animate-spin" /> 
                  Trading...
                </>
              ) : (
                <>
                  Trading <ArrowRight className="h-3 w-3 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
