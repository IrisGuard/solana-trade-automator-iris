
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Token } from "@/types/wallet";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletTokensListProps {
  tokens: Token[];
  isLoading?: boolean; // Added isLoading as an optional prop
}

export function WalletTokensList({ tokens, isLoading }: WalletTokensListProps) {
  // Display loading state if isLoading is true
  if (isLoading) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p>Φόρτωση tokens...</p>
      </div>
    );
  }
  
  // Display empty state if no tokens
  if (tokens.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        <p>Δεν βρέθηκαν tokens</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Υπόλοιπο Token</CardTitle>
        <CardDescription>Τα Solana SPL tokens σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tokens.map((token, index) => (
          <div key={index} className="flex items-center justify-between pb-2 border-b last:border-0 last:pb-0">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center">
                {token.logo ? (
                  <img src={token.logo} alt={token.symbol} className="h-6 w-6 rounded-full" />
                ) : (
                  <span className="text-primary-foreground text-xs">{token.symbol}</span>
                )}
              </div>
              <div>
                <p className="font-medium">{token.name}</p>
                <p className="text-sm text-muted-foreground">{token.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{token.amount.toLocaleString()} {token.symbol}</p>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-xs" 
                onClick={() => window.open(`https://solscan.io/token/${token.address}`, '_blank')}
              >
                Προβολή <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
