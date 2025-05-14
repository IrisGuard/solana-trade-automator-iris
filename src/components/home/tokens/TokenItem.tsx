
import React from "react";
import { Button } from "@/components/ui/button";
import { Token } from "@/types/wallet";
import { formatTokenAmount } from "@/utils/tokenUtils";

interface TokenItemProps {
  token: Token;
  price?: number;
  isSelected?: boolean;
  disabled?: boolean;
  onSelect?: (tokenAddress: string) => void;
  onTradingClick?: (tokenAddress: string) => void;
}

export function TokenItem({ 
  token, 
  price, 
  isSelected = false,
  disabled = false,
  onSelect,
  onTradingClick
}: TokenItemProps) {
  // Handle token selection
  const handleClick = () => {
    if (onSelect && !disabled) {
      onSelect(token.address);
    }
  };
  
  // Handle trading button click
  const handleTradingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTradingClick && !disabled) {
      onTradingClick(token.address);
    }
  };
  
  // Format token amount
  const formattedAmount = formatTokenAmount(token);
  
  // Calculate token value if price is available
  const tokenValue = price ? (token.amount / Math.pow(10, token.decimals)) * price : undefined;
  
  return (
    <div 
      className={`flex items-center justify-between p-3 border rounded-md transition-colors ${
        isSelected ? 'border-primary bg-primary/5' : 'hover:bg-accent/50 cursor-pointer'
      } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        {token.logo ? (
          <img 
            src={token.logo} 
            alt={`${token.symbol} logo`} 
            className="w-8 h-8 rounded-full mr-3"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
            <span className="text-xs font-medium text-primary">{token.symbol.substring(0, 2)}</span>
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-sm">{token.name}</h4>
          <p className="text-xs text-muted-foreground">{token.symbol}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="font-medium">{formattedAmount}</span>
        
        {tokenValue !== undefined && (
          <span className="text-xs text-muted-foreground">
            ≈ ${tokenValue.toFixed(2)}
          </span>
        )}
      </div>
      
      {onTradingClick && (
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2"
          onClick={handleTradingClick}
          disabled={disabled}
        >
          Trade
        </Button>
      )}
    </div>
  );
}
