
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Token } from '@/types/wallet';
import { Search } from 'lucide-react';

interface TokenSelectorProps {
  tokens: Token[];
  onSelectToken: (tokenAddress: string) => void;
  selectedToken?: string | null;
}

export function TokenSelector({ tokens, onSelectToken, selectedToken }: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle token selection
  const handleSelectToken = (tokenAddress: string) => {
    onSelectToken(tokenAddress);
    setIsOpen(false);
  };

  // Find selected token details
  const selectedTokenDetails = tokens.find(t => t.address === selectedToken);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
        >
          {selectedTokenDetails ? (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {selectedTokenDetails.logo ? (
                  <img src={selectedTokenDetails.logo} alt={selectedTokenDetails.symbol} className="h-5 w-5" />
                ) : (
                  <span className="text-xs font-bold">{selectedTokenDetails.symbol.slice(0, 3)}</span>
                )}
              </div>
              <span>{selectedTokenDetails.symbol}</span>
              <span className="text-muted-foreground">
                ({selectedTokenDetails.amount})
              </span>
            </div>
          ) : (
            <span>Επιλέξτε token</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Επιλογή Token</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Αναζήτηση token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="max-h-72 overflow-y-auto space-y-1">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <div
                  key={token.address}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-muted ${
                    token.address === selectedToken ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => handleSelectToken(token.address)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {token.logo ? (
                        <img src={token.logo} alt={token.symbol} className="h-6 w-6" />
                      ) : (
                        <span className="text-xs font-bold">{token.symbol.slice(0, 3)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-xs text-muted-foreground">{token.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{token.amount}</div>
                    <div className="text-xs text-muted-foreground">Διαθέσιμο</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Δεν βρέθηκαν tokens
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
