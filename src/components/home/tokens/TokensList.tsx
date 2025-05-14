
import React from "react";
import { Token } from "@/types/wallet";
import { TokenItem } from "./TokenItem";
import { Skeleton } from "@/components/ui/skeleton";

interface TokensListProps {
  tokens: Token[];
  filteredTokens: Token[];
  selectedToken: string | null;
  tokenPrices?: Record<string, number>;
  isLoadingTokens?: boolean;
  isLoading?: boolean;
  connectionError?: string | null;
  onSelectToken?: (tokenAddress: string) => void;
  onTradingClick?: (tokenAddress: string) => void;
}

export function TokensList({
  tokens,
  filteredTokens,
  selectedToken,
  tokenPrices,
  isLoadingTokens = false,
  isLoading = false,
  connectionError = null,
  onSelectToken,
  onTradingClick
}: TokensListProps) {
  if (isLoadingTokens) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center p-3 border rounded-md">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="ml-3 space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-600">Σφάλμα φόρτωσης tokens: {connectionError}</p>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center p-6 border border-dashed rounded-md">
        <p className="text-muted-foreground">Δεν βρέθηκαν tokens στο πορτοφόλι σας.</p>
      </div>
    );
  }

  if (filteredTokens.length === 0) {
    return (
      <div className="text-center p-6 border border-dashed rounded-md">
        <p className="text-muted-foreground">Δεν βρέθηκαν tokens που να ταιριάζουν με την αναζήτησή σας.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTokens.map((token) => (
        <TokenItem
          key={token.address}
          token={token}
          price={tokenPrices?.[token.address]}
          isSelected={token.address === selectedToken}
          onSelect={onSelectToken}
          onTradingClick={onTradingClick}
          disabled={isLoading}
        />
      ))}
    </div>
  );
}
