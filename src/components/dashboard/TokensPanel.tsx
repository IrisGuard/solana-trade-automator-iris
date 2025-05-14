
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Token } from '@/types/wallet';

interface TokensPanelProps {
  tokens: Token[];
  tokenPrices?: Record<string, number>;
  isLoading?: boolean;
}

export function TokensPanel({ tokens, tokenPrices = {}, isLoading = false }: TokensPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : tokens.length > 0 ? (
          <div className="space-y-4">
            {tokens.map((token) => {
              const price = tokenPrices[token.address] || 0;
              const value = token.amount * price;
              
              return (
                <div 
                  key={token.address}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                      {token.logo ? (
                        <img 
                          src={token.logo}
                          alt={token.symbol}
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = '';
                            e.currentTarget.parentElement!.innerHTML = token.symbol.substring(0, 2);
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-primary/5 text-primary font-medium">
                          {token.symbol.substring(0, 2)}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">{token.name}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div>{token.amount.toFixed(token.decimals > 6 ? 4 : 2)}</div>
                    {price > 0 && (
                      <div className="text-sm text-muted-foreground">${value.toFixed(2)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tokens found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
