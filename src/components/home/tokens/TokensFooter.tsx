
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";

interface TokensFooterProps {
  selectedToken: string;
  isLoading: boolean;
  onTradingClick: (tokenAddress: string) => void;
}

export function TokensFooter({
  selectedToken,
  isLoading,
  onTradingClick
}: TokensFooterProps) {
  return (
    <div className="w-full flex justify-end">
      <Button 
        onClick={() => onTradingClick(selectedToken)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        Ρύθμιση Trading Bot
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
