
import React from "react";
import { Token } from "@/types/wallet";
import { TokenItem } from "./TokenItem";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/hooks/use-language";

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
  const { t } = useLanguage();

  // Loading state
  if (isLoadingTokens) {
    return (
      <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary animate-spin mb-3 sm:mb-4" />
        <p className="text-muted-foreground">Φόρτωση tokens...</p>
      </div>
    );
  }

  // Error state
  if (connectionError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">{connectionError}</AlertDescription>
      </Alert>
    );
  }

  // Empty state - no tokens at all
  if (tokens.length === 0) {
    return (
      <div className="py-6 sm:py-8 text-center">
        <div className="bg-primary/10 rounded-full h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <h3 className="text-base sm:text-lg font-medium mb-1">Δεν βρέθηκαν tokens</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto px-2">
          Δεν έχετε καθόλου tokens στο πορτοφόλι σας. Για να χρησιμοποιήσετε την πλατφόρμα μας, 
          χρειάζεστε tokens SOL ή άλλα SPL tokens.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open("https://solana.com/ecosystem/exchangeswap", "_blank")}
        >
          Αγορά SOL
        </Button>
      </div>
    );
  }

  // Empty search results
  if (filteredTokens.length === 0) {
    return (
      <div className="py-6 sm:py-8 text-center">
        <p className="text-muted-foreground">Δεν βρέθηκαν αποτελέσματα για την αναζήτησή σας.</p>
        <Button 
          variant="link" 
          onClick={() => document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()}
        >
          Καθαρισμός αναζήτησης
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {filteredTokens.map((token) => (
        <TokenItem
          key={token.address}
          token={token}
          price={tokenPrices?.[token.address]}
          isSelected={selectedToken === token.address}
          isLoading={isLoading && selectedToken === token.address}
          onSelect={() => onSelectToken?.(token.address)}
          onTradingClick={() => onTradingClick?.(token.address)}
        />
      ))}
    </div>
  );
}
