
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, ArrowRight, TrendingUp, TrendingDown, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { Token } from "@/types/wallet";
import { Input } from "@/components/ui/input";

interface TokensCardProps {
  tokens: Token[];
  displayAddress: string;
  tokenPrices?: Record<string, number>;
  selectTokenForTrading?: (tokenAddress: string) => Token | null;
  isLoadingTokens?: boolean;
}

export function TokensCard({ 
  tokens, 
  displayAddress,
  tokenPrices,
  selectTokenForTrading,
  isLoadingTokens = false
}: TokensCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Φιλτράρισμα των tokens βάσει του ερωτήματος αναζήτησης
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectToken = (tokenAddress: string) => {
    setSelectedToken(tokenAddress === selectedToken ? null : tokenAddress);
  };

  const handleTradingClick = (tokenAddress: string) => {
    if (selectTokenForTrading) {
      setIsLoading(true);
      try {
        selectTokenForTrading(tokenAddress);
        // Πλοήγηση στη σελίδα bot control μετά από μικρή καθυστέρηση
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

  // Υπολογισμός της τάσης της τιμής για ένα token (θα μπορούσε να αντικατασταθεί με πραγματικά δεδομένα)
  const getTokenPriceTrend = (tokenAddress: string) => {
    // Σε μια πραγματική εφαρμογή, θα συγκρίναμε την τρέχουσα τιμή με μια προηγούμενη τιμή
    return Math.random() > 0.5;
  };

  // Μορφοποίηση αριθμών με διαχωριστικό χιλιάδων και περιορισμό δεκαδικών
  const formatNumber = (num: number, maxDecimals: number = 6) => {
    // Για μεγάλους αριθμούς, περιορισμός των δεκαδικών
    if (num >= 1000) {
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    // Για μικρούς αριθμούς, διατήρηση περισσότερων δεκαδικών
    else {
      return num.toLocaleString(undefined, { maximumFractionDigits: maxDecimals });
    }
  };

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
        {isLoadingTokens || tokens.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p>Φόρτωση tokens...</p>
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Δεν βρέθηκαν tokens που να ταιριάζουν με την αναζήτησή σας</p>
          </div>
        ) : (
          filteredTokens.map((token, index) => {
            const isPositiveTrend = getTokenPriceTrend(token.address);
            const tokenPrice = tokenPrices?.[token.address];
            const tokenValue = tokenPrice ? token.amount * tokenPrice : null;
            
            return (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${selectedToken === token.address ? 'bg-primary/10' : 'hover:bg-muted'} cursor-pointer border-b last:border-0 last:pb-0`}
                onClick={() => handleSelectToken(token.address)}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center overflow-hidden">
                    {token.logo ? (
                      <img src={token.logo} alt={token.symbol} className="h-8 w-8" />
                    ) : (
                      <span className="text-primary-foreground text-xs font-bold">{token.symbol.slice(0, 3)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{token.name}</p>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">{token.symbol}</span>
                      {isPositiveTrend ? (
                        <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 ml-1 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatNumber(token.amount)} {token.symbol}</p>
                  {tokenValue && (
                    <p className="text-xs text-muted-foreground">
                      ≈ ${formatNumber(tokenValue, 2)}
                    </p>
                  )}
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
                        disabled={isLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTradingClick(token.address);
                        }}
                      >
                        {isLoading ? (
                          <>
                            <Loader className="h-3 w-3 mr-1 animate-spin" /> 
                            Trading...
                          </>
                        ) : (
                          <>
                            Trading <ArrowRight className="h-3 w-3 ml-1" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
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
            disabled={isLoading}
            onClick={() => handleTradingClick(selectedToken)}
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" /> 
                Επεξεργασία...
              </>
            ) : (
              <>
                Δημιουργία Trading Bot για το επιλεγμένο token
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
