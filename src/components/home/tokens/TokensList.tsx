
import React from "react";
import { Token } from "@/types/wallet";
import { TokenItem } from "./TokenItem";
import { Loader, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TokensListProps {
  tokens: Token[];
  filteredTokens: Token[];
  selectedToken: string | null;
  tokenPrices?: Record<string, number>;
  onSelectToken: (address: string) => void;
  onTradingClick: (address: string) => void;
  isLoadingTokens?: boolean;
  isLoading?: boolean;
  connectionError?: string | null;
}

export function TokensList({
  tokens,
  filteredTokens,
  selectedToken,
  tokenPrices,
  onSelectToken,
  onTradingClick,
  isLoadingTokens = false,
  isLoading = false,
  connectionError = null
}: TokensListProps) {
  // Error View
  if (connectionError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-2">
          <div>{connectionError}</div>
          <div className="text-sm">
            Προσπαθούμε να συνδεθούμε με το δίκτυο Solana. Παρακαλώ περιμένετε ή 
            προσπαθήστε να συνδεθείτε ξανά με το πορτοφόλι σας.
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Loading View
  if (isLoadingTokens || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Loader className="h-10 w-10 animate-spin mb-4 text-primary" />
        <div>
          <p className="text-lg font-medium mb-1">Φόρτωση tokens...</p>
          <p className="text-sm text-muted-foreground">
            Παρακαλώ περιμένετε όσο φορτώνουμε τις πληροφορίες του πορτοφολιού σας
          </p>
        </div>
      </div>
    );
  }

  // Empty View
  if (!isLoadingTokens && filteredTokens.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium">Δε βρέθηκαν tokens</p>
        {tokens.length > 0 ? (
          <p className="text-sm text-muted-foreground">Δοκιμάστε διαφορετικά κριτήρια αναζήτησης</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Το πορτοφόλι σας δεν έχει tokens αυτή τη στιγμή
          </p>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-2">
      {filteredTokens.map((token) => (
        <TokenItem
          key={token.address}
          token={token}
          price={tokenPrices?.[token.address]}
          isSelected={selectedToken === token.address}
          onSelect={() => onSelectToken(token.address)}
          onTradingClick={() => onTradingClick(token.address)}
        />
      ))}
    </div>
  );
}
