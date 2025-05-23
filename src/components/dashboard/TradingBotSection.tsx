
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Play, Square, Settings } from 'lucide-react';
import { Token } from '@/hooks/useTokens';

interface TradingBotSectionProps {
  connected: boolean;
  tokens: Token[];
  walletAddress: string | null;
}

export function TradingBotSection({
  connected,
  tokens,
  walletAddress,
}: TradingBotSectionProps) {
  const [isActive, setIsActive] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>('');

  const handleToggleBot = () => {
    if (!selectedToken) {
      alert('Παρακαλώ επιλέξτε ένα token πρώτα');
      return;
    }
    setIsActive(!isActive);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Trading Bot
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Ενεργό' : 'Ανενεργό'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connected ? (
          <div className="text-center py-4 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Συνδέστε το πορτοφόλι για να χρησιμοποιήσετε το bot</p>
          </div>
        ) : (
          <>
            {/* Token Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Επιλογή Token:
              </label>
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full p-2 border border-border rounded bg-background"
                disabled={isActive}
              >
                <option value="">Επιλέξτε token...</option>
                {tokens.map((token) => (
                  <option key={token.mint} value={token.mint}>
                    {token.symbol} ({token.amount.toFixed(4)})
                  </option>
                ))}
              </select>
            </div>

            {/* Bot Controls */}
            <div className="space-y-2">
              <Button
                onClick={handleToggleBot}
                className="w-full"
                variant={isActive ? 'destructive' : 'default'}
                disabled={!selectedToken}
              >
                {isActive ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Διακοπή Bot
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Εκκίνηση Bot
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                disabled={isActive}
              >
                <Settings className="h-4 w-4 mr-2" />
                Ρυθμίσεις
              </Button>
            </div>

            {/* Bot Status */}
            {isActive && (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                <div className="text-sm">
                  <div className="font-medium text-green-800 dark:text-green-200 mb-1">
                    Bot Ενεργό
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    Παρακολουθεί το {tokens.find(t => t.mint === selectedToken)?.symbol}
                  </div>
                </div>
              </div>
            )}

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">+2.4%</div>
                <div className="text-xs text-muted-foreground">24h P&L</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-muted-foreground">Trades</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
