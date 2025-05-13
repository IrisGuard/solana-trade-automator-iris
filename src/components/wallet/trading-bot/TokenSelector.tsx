
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Token } from "@/types/wallet";

interface TokenSelectorProps {
  tokens: Token[];
  onSelectToken: (tokenId: string | null) => void;
  selectedToken: string | null;
}

export function TokenSelector({ tokens, onSelectToken, selectedToken }: TokenSelectorProps) {
  return (
    <div className="space-y-2">
      <Select
        value={selectedToken || ""}
        onValueChange={(value) => onSelectToken(value || null)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Επιλέξτε token" />
        </SelectTrigger>
        <SelectContent>
          {tokens.length === 0 ? (
            <SelectItem disabled value="empty">
              Δεν βρέθηκαν tokens
            </SelectItem>
          ) : (
            tokens.map((token) => (
              <SelectItem key={token.address} value={token.address}>
                <div className="flex items-center">
                  {token.logo && (
                    <img 
                      src={token.logo} 
                      alt={token.symbol} 
                      className="w-5 h-5 mr-2 rounded-full"
                    />
                  )}
                  {token.symbol} ({token.amount.toFixed(4)})
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
