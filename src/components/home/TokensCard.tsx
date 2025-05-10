
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Token } from "@/types/wallet";
import { Input } from "@/components/ui/input";

interface TokensCardProps {
  tokens: Token[];
  displayAddress: string;
}

export function TokensCard({ tokens, displayAddress }: TokensCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  
  // Filter tokens based on search query
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Υπόλοιπο Tokens</CardTitle>
            <CardDescription>Τα Solana SPL tokens σας</CardDescription>
          </div>
          <div className="relative w-full sm:w-auto sm:min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Αναζήτηση tokens..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredTokens.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Δεν βρέθηκαν tokens που να ταιριάζουν με την αναζήτησή σας</p>
          </div>
        ) : (
          filteredTokens.map((token, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${selectedToken === token.address ? 'bg-primary/10' : 'hover:bg-muted'} cursor-pointer border-b last:border-0 last:pb-0`}
              onClick={() => setSelectedToken(token.address === selectedToken ? null : token.address)}
            >
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center">
                  {token.logo ? (
                    <img src={token.logo} alt={token.symbol} className="h-8 w-8 rounded-full" />
                  ) : (
                    <span className="text-primary-foreground text-xs font-bold">{token.symbol.slice(0, 3)}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{token.name}</p>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">{token.symbol}</span>
                    {Math.random() > 0.5 ? (
                      <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 ml-1 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{token.amount.toLocaleString()} {token.symbol}</p>
                <div className="flex items-center gap-1 justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs" 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://solscan.io/token/${token.address}`, '_blank');
                    }}
                  >
                    Προβολή <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  {selectedToken === token.address && (
                    <Button 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/bot-control?token=${token.address}`;
                      }}
                    >
                      Trading <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div className="pt-2">
          <Link to="/tokens">
            <Button variant="outline" size="sm" className="w-full">
              Προβολή όλων των tokens
            </Button>
          </Link>
        </div>
      </CardContent>
      {selectedToken && (
        <CardFooter className="pt-2 pb-4 border-t">
          <Button 
            className="w-full"
            onClick={() => window.location.href = `/bot-control?token=${selectedToken}`}
          >
            Δημιουργία Trading Bot για το επιλεγμένο token
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
