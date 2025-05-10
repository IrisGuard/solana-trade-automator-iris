import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Token } from "@/types/wallet";

interface TokensCardProps {
  tokens: Token[];
  displayAddress: string;
}

export function TokensCard({ tokens, displayAddress }: TokensCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Υπόλοιπο Tokens</CardTitle>
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
        <div className="pt-2">
          <Link to="/tokens">
            <Button variant="outline" size="sm" className="w-full">
              Προβολή όλων των tokens
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
