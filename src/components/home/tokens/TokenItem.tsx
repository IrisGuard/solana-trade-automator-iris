
import React from "react";
import { Token } from "@/types/wallet";
import { formatTokenAmount } from "@/utils/token";

interface TokenItemProps {
  token: Token;
  onSelectToken?: (tokenAddress: string) => void;
  onTradingClick?: (tokenAddress: string) => void;
  isLoading?: boolean;
  isSelected?: boolean;
}

export function TokenItem({
  token,
  onSelectToken,
  onTradingClick,
  isLoading = false,
  isSelected = false,
}: TokenItemProps) {
  const handleClick = () => {
    if (onSelectToken) {
      onSelectToken(token.address);
    }
  };

  const handleTradingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTradingClick) {
      onTradingClick(token.address);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        {token.logo ? (
          <img
            src={token.logo}
            alt={token.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold">
              {token.symbol.substring(0, 2)}
            </span>
          </div>
        )}
        <div>
          <div className="font-medium">{token.name}</div>
          <div className="text-sm text-muted-foreground">{token.symbol}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">
          {formatTokenAmount(token)}
        </div>
        <button
          className="text-xs text-primary hover:underline"
          onClick={handleTradingClick}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Trade"}
        </button>
      </div>
    </div>
  );
}
