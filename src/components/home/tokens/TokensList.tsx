
import React from "react";
import { Token } from "@/types/wallet";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TokensListProps {
  tokens: Token[];
  filteredTokens: Token[];
  selectedToken: string | null;
  tokenPrices?: Record<string, number>;
  isLoadingTokens: boolean;
  isLoading: boolean;
  connectionError: string | null;
  onSelectToken: (tokenAddress: string) => void;
  onTradingClick: (tokenAddress: string) => void;
}

export function TokensList({
  tokens,
  filteredTokens,
  selectedToken,
  tokenPrices,
  isLoadingTokens,
  isLoading,
  connectionError,
  onSelectToken,
  onTradingClick
}: TokensListProps) {
  if (isLoadingTokens) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-2">Σφάλμα φόρτωσης tokens</p>
        <p className="text-sm text-muted-foreground">{connectionError}</p>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-2">Δεν βρέθηκαν tokens</p>
        <p className="text-sm text-muted-foreground">
          Συνδέστε το πορτοφόλι σας για να δείτε τα tokens σας
        </p>
      </div>
    );
  }

  if (filteredTokens.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Δεν βρέθηκαν αποτελέσματα με αυτά τα κριτήρια αναζήτησης</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTokens.map((token) => (
        <div 
          key={token.address}
          className={`p-3 border rounded-md cursor-pointer transition-colors ${
            selectedToken === token.address ? "border-primary bg-primary/5" : "hover:bg-secondary/50"
          }`}
          onClick={() => onSelectToken(token.address)}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {token.symbol.slice(0, 1)}
              </div>
              <div>
                <div className="font-medium">{token.symbol}</div>
                <div className="text-sm text-muted-foreground">{token.name || token.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{token.amount.toFixed(4)}</div>
              {tokenPrices && tokenPrices[token.address] && (
                <div className="text-sm text-muted-foreground">
                  ${(token.amount * tokenPrices[token.address]).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
