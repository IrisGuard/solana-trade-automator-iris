
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Coins, TrendingUp, Wallet } from 'lucide-react';
import { Token } from '@/types/wallet';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface TokensDisplayProps {
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  isConnected: boolean;
}

export function TokensDisplay({ 
  tokens, 
  isLoading, 
  error, 
  onRefresh,
  isConnected 
}: TokensDisplayProps) {
  const formatAmount = (amount: number, decimals: number = 9) => {
    if (amount === 0) return '0';
    if (amount < 0.001) return amount.toFixed(6);
    return amount.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Συνδέστε το Phantom Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-4">
            Συνδέστε το Phantom wallet σας για να δείτε τα κρυπτονομίσματά σας
          </p>
          <Button onClick={() => toast.info('Κάντε κλικ στο κουμπί "Connect Wallet" παραπάνω')}>
            <Wallet className="h-4 w-4 mr-2" />
            Οδηγίες Σύνδεσης
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Τα Κρυπτονομίσματά μου ({tokens.length})
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
          <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="font-medium">Σφάλμα φόρτωσης:</p>
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="w-20 h-4 mb-1" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
                <Skeleton className="w-16 h-4" />
              </div>
            ))}
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-8">
            <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Δεν βρέθηκαν tokens</h3>
            <p className="text-muted-foreground mb-4">
              Δεν έχετε κρυπτονομίσματα στο πορτοφόλι σας ή δεν έχουν φορτωθεί ακόμη.
            </p>
            <Button variant="outline" onClick={onRefresh}>
              Δοκιμάστε Ξανά
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {tokens.map((token) => (
              <div
                key={token.address}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {token.logo ? (
                      <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
                    ) : (
                      token.symbol?.charAt(0) || '?'
                    )}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {token.name || token.symbol}
                      {token.symbol === 'SOL' && (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {token.symbol} • {token.decimals} decimals
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium">
                    {formatAmount(token.amount, token.decimals)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {token.symbol}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tokens.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Συμβουλή:</strong> Τα tokens εμφανίζονται από το mainnet του Solana. 
              Αν δεν βλέπετε κάποιο token, βεβαιωθείτε ότι έχετε υπόλοιπο μεγαλύτερο από 0.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
