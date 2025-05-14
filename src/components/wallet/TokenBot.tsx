
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Token } from '@/types/wallet';
import { formatAmount } from '@/utils/tokenUtils';

interface TokenBotProps {
  tokens: Token[];
  isConnected: boolean;
  onConnectWallet: () => Promise<void>;
}

export function TokenBot({ tokens, isConnected, onConnectWallet }: TokenBotProps) {
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [strategy, setStrategy] = useState<string>('grid');
  
  const handleTokenChange = (value: string) => {
    setSelectedToken(value);
  };
  
  const handleStartBot = () => {
    if (!selectedToken || !amount) {
      return;
    }
    
    console.log('Starting bot with:', {
      token: selectedToken,
      amount,
      strategy
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Bot</CardTitle>
        <CardDescription>Ρυθμίστε το αυτόματο bot συναλλαγών</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Επιλογή Token</label>
              <Select value={selectedToken} onValueChange={handleTokenChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol} - {token.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ποσό Συναλλαγών</label>
              <Input 
                type="number" 
                placeholder="Εισάγετε ποσό"
                value={amount}
                onChange={(e) => setAmount(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Στρατηγική</label>
              <Select value={strategy} onValueChange={(value) => setStrategy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Trading</SelectItem>
                  <SelectItem value="dca">DCA (Dollar Cost Average)</SelectItem>
                  <SelectItem value="market-making">Market Making</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedToken && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p>
                  <strong>Διαθέσιμο Υπόλοιπο:</strong>{' '}
                  {tokens.find(token => token.address === selectedToken)?.amount
                    ? formatAmount(tokens.find(token => token.address === selectedToken)?.amount || 0)
                    : '0'}{' '}
                  {tokens.find(token => token.address === selectedToken)?.symbol}
                </p>
              </div>
            )}
            
            <Button 
              className="w-full" 
              onClick={handleStartBot}
              disabled={!selectedToken || !amount}
            >
              Εκκίνηση Bot
            </Button>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Συνδεθείτε με το wallet σας για να χρησιμοποιήσετε το trading bot</p>
            <Button onClick={onConnectWallet}>Σύνδεση Wallet</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
