
import React from "react";
import { Loader } from "lucide-react";
import { Token } from "@/types/wallet";
import { TokenItem } from "./TokenItem";

interface TokensListProps {
  tokens: Token[];
  filteredTokens: Token[];
  selectedToken: string | null;
  tokenPrices?: Record<string, number>;
  isLoadingTokens?: boolean;
  isLoading?: boolean;
  onSelectToken: (tokenAddress: string) => void;
  onTradingClick: (tokenAddress: string) => void;
}

export function TokensList({
  tokens,
  filteredTokens,
  selectedToken,
  tokenPrices,
  isLoadingTokens = false,
  isLoading = false,
  onSelectToken,
  onTradingClick
}: TokensListProps) {
  if (isLoadingTokens) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p>Φόρτωση tokens...</p>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>Δεν βρέθηκαν tokens στο πορτοφόλι</p>
      </div>
    );
  }

  if (filteredTokens.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>Δεν βρέθηκαν tokens που να ταιριάζουν με την αναζήτησή σας</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTokens.map((token, index) => (
        <TokenItem
          key={index}
          token={token}
          selectedToken={selectedToken}
          tokenPrice={tokenPrices?.[token.address]}
          isLoading={isLoading}
          onSelectToken={onSelectToken}
          onTradingClick={onTradingClick}
        />
      ))}
    </div>
  );
}
