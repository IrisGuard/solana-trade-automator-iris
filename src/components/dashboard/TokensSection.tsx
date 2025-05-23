
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Token } from '@/hooks/useTokens';

interface TokensSectionProps {
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function TokensSection({
  tokens,
  isLoading,
  error,
  onRefresh,
}: TokensSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Tokens ({tokens.length})
          </CardTitle>
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Ανανέωση
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="w-20 h-4 bg-gray-300 rounded mb-1"></div>
                      <div className="w-16 h-3 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                  <div className="w-16 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Δεν βρέθηκαν tokens στο πορτοφόλι σας</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tokens.map((token) => (
              <div
                key={token.mint}
                className="flex items-center justify-between p-3 bg-muted/50 rounded hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {token.symbol?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="font-medium">
                      {token.symbol || 'Unknown'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {`${token.mint.slice(0, 8)}...${token.mint.slice(-8)}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium">
                    {token.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {token.decimals} decimals
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
