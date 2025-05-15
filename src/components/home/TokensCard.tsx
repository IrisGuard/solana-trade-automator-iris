
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Token } from "@/types/wallet";
import { TokensList } from "./tokens/TokensList";
import { TokenPrice, TokenPrices } from "@/services/solana/price/types";

export interface TokensCardProps {
  walletAddress?: string | null;
  tokens?: Token[];
  tokenPrices?: TokenPrices;
  isLoading?: boolean;
  onSelectToken?: (tokenAddress: string) => any;
}

export function TokensCard({ 
  walletAddress, 
  tokens = [], 
  tokenPrices = {},
  isLoading = false,
  onSelectToken
}: TokensCardProps) {
  // Convert TokenPrices (Record<string, TokenPrice>) to Record<string, number>
  const tokenPricesAsNumbers: Record<string, number> = Object.fromEntries(
    Object.entries(tokenPrices).map(([k, v]) => [k, v.price])
  );
  
  // Add state for selected token and filtered tokens
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  // Set filtered tokens to all tokens initially
  const filteredTokens = tokens;
  
  // If wallet address doesn't exist, show placeholder
  if (!walletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Τα Tokens μου</CardTitle>
          <CardDescription>Συνδεθείτε για να δείτε τα tokens σας</CardDescription>
        </CardHeader>
        <CardContent className="py-6 text-center text-muted-foreground">
          <p>Δεν έχετε συνδέσει πορτοφόλι</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Τα Tokens μου</CardTitle>
          <CardDescription>
            {tokens.length > 0
              ? `${tokens.length} διαθέσιμα tokens`
              : "Δεν βρέθηκαν tokens"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : tokens.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <p>Δεν βρέθηκαν tokens στο πορτοφόλι σας</p>
          </div>
        ) : (
          <div className="space-y-4">
            <TokensList 
              tokens={tokens.slice(0, 5)} 
              tokenPrices={tokenPricesAsNumbers}
              filteredTokens={filteredTokens.slice(0, 5)}
              selectedToken={selectedToken}
              onSelectToken={(tokenAddress) => {
                setSelectedToken(tokenAddress);
                onSelectToken?.(tokenAddress);
              }}
            />
            
            <div className="mt-4 text-right">
              <Link to="/wallet">
                <Button variant="ghost" size="sm" className="gap-1">
                  Προβολή όλων <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
