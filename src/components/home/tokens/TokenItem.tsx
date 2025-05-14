
import React from "react";
import { formatTokenAmount } from "@/utils/tokenUtils";
import { Token } from "@/types/wallet";
import Image from "@/components/ui/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface TokenItemProps {
  token: Token;
  isSelected?: boolean;
  tokenPrice?: number;
  onSelect?: (tokenAddress: string) => void;
  onTradingClick?: (tokenAddress: string) => void;
  isLoading?: boolean;
}

export function TokenItem({
  token,
  isSelected = false,
  tokenPrice,
  onSelect,
  onTradingClick,
  isLoading = false,
}: TokenItemProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(token.address);
    }
  };
  
  const handleTradingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTradingClick) {
      onTradingClick(token.address);
    }
  };
  
  // Format the token amount with proper decimals
  const formattedAmount = formatTokenAmount(token.amount, token.decimals);
  
  // Calculate USD value if price is available
  const usdValue = tokenPrice ? (token.amount * tokenPrice).toFixed(2) : undefined;
  
  // Default token logo if not provided
  const tokenLogo = token.logo || `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${token.address}/logo.png`;
  
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer",
        isSelected ? "bg-primary/10" : "hover:bg-muted",
        isLoading && "opacity-70 pointer-events-none"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 overflow-hidden rounded-full bg-muted">
          <AspectRatio ratio={1/1}>
            <Image 
              src={tokenLogo}
              alt={token.symbol}
              className="object-cover"
              fallback={
                <div className="flex items-center justify-center w-full h-full bg-primary/5 text-primary font-medium">
                  {token.symbol.substring(0, 2)}
                </div>
              }
            />
          </AspectRatio>
        </div>
        
        <div>
          <div className="font-medium">{token.symbol}</div>
          <div className="text-sm text-muted-foreground">{token.name || token.symbol}</div>
        </div>
      </div>
      
      <div className="text-right">
        <div>{formattedAmount}</div>
        {usdValue && (
          <div className="text-sm text-muted-foreground">${usdValue}</div>
        )}
      </div>
    </div>
  );
}
