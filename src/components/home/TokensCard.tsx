
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Token } from "@/types/wallet";
import { TokensHeader } from "./tokens/TokensHeader";
import { TokensList } from "./tokens/TokensList";
import { TokensFooter } from "./tokens/TokensFooter";

interface TokensCardProps {
  tokens: Token[];
  tokenPrices?: Record<string, number>;
  onSelectToken?: (tokenAddress: string) => Token | null;
  isLoadingTokens?: boolean;
  connectionError?: string | null;
}

export function TokensCard({ 
  tokens, 
  tokenPrices,
  onSelectToken,
  isLoadingTokens = false,
  connectionError = null
}: TokensCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Filter tokens based on search query
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle token selection
  const handleSelectToken = (tokenAddress: string) => {
    setSelectedToken(tokenAddress === selectedToken ? null : tokenAddress);
  };

  // Handle trading button click
  const handleTradingClick = (tokenAddress: string) => {
    if (onSelectToken) {
      setIsLoading(true);
      try {
        onSelectToken(tokenAddress);
        // Navigate to bot control page after a brief delay
        setTimeout(() => {
          window.location.href = `/bot-control?token=${tokenAddress}`;
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error selecting token:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <TokensHeader 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <TokensList
          tokens={tokens}
          filteredTokens={filteredTokens}
          selectedToken={selectedToken}
          tokenPrices={tokenPrices}
          isLoadingTokens={isLoadingTokens}
          isLoading={isLoading}
          connectionError={connectionError}
          onSelectToken={handleSelectToken}
          onTradingClick={handleTradingClick}
        />
      </CardContent>
      {selectedToken && (
        <CardFooter className="pt-2 pb-4 border-t">
          <TokensFooter 
            selectedToken={selectedToken}
            isLoading={isLoading}
            onTradingClick={handleTradingClick}
          />
        </CardFooter>
      )}
    </Card>
  );
}
