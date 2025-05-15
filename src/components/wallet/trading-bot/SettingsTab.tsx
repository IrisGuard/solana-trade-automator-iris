
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TradingBotConfig } from "@/hooks/trading-bot/types";
import { Token } from "@/types/wallet";

interface SettingsTabProps {
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  selectToken: (token: string | null) => Promise<void>;
  selectedTokenPrice: any;
  selectedTokenDetails?: Token;
  tokens: Token[];
}

export function SettingsTab({
  config,
  updateConfig,
  selectToken,
  selectedTokenPrice,
  selectedTokenDetails,
  tokens
}: SettingsTabProps) {
  const handleTokenSelect = async (value: string) => {
    await selectToken(value);
  };

  const formatTokenAmount = (token: Token) => {
    if (!token.amount) return "0";
    
    // For large numbers, show with fewer decimals
    if (token.amount >= 1000) {
      return token.amount.toFixed(2);
    }
    
    // For small numbers, show more decimals
    if (token.amount < 0.01) {
      return token.amount.toFixed(8);
    }
    
    return token.amount.toFixed(4);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Ρυθμίσεις Bot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Επιλογή Token</Label>
            <Select value={config.selectedToken || ""} onValueChange={handleTokenSelect}>
              <SelectTrigger id="token">
                <SelectValue placeholder="Επιλέξτε token για συναλλαγές" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    <div className="flex items-center">
                      {token.logo ? (
                        <img 
                          src={token.logo} 
                          alt={token.symbol} 
                          className="w-4 h-4 mr-2 rounded-full"
                        />
                      ) : (
                        <div className="w-4 h-4 mr-2 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs">{token.symbol.substring(0, 1)}</span>
                        </div>
                      )}
                      {token.symbol} - {formatTokenAmount(token)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTokenDetails && (
            <div className="pt-4">
              <div className="rounded-md bg-muted p-4">
                <h4 className="font-medium mb-2">Επιλεγμένο Token: {selectedTokenDetails.symbol}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Διαθέσιμο:</span>{" "}
                    {formatTokenAmount(selectedTokenDetails)} {selectedTokenDetails.symbol}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Τιμή:</span>{" "}
                    ${selectedTokenPrice?.currentPrice?.toFixed(4) || "N/A"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Μεταβολή 24h:</span>{" "}
                    <span className={selectedTokenPrice?.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                      {selectedTokenPrice?.priceChange24h?.toFixed(2) || "N/A"}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Δυνατότητα Συναλλαγής:</span>{" "}
                    {selectedTokenDetails.amount > 0 ? "Ναι" : "Όχι"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <Label htmlFor="strategy">Στρατηγική</Label>
            <Select 
              value={config.strategy} 
              onValueChange={(value) => updateConfig({ strategy: value as 'simple' | 'advanced' | 'custom' | 'dca' | 'grid' | 'momentum' })}>
              <SelectTrigger id="strategy">
                <SelectValue placeholder="Επιλέξτε στρατηγική" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Απλή (Buy Low / Sell High)</SelectItem>
                <SelectItem value="advanced">Προχωρημένη (Με δείκτες)</SelectItem>
                <SelectItem value="custom">Προσαρμοσμένη</SelectItem>
                <SelectItem value="dca">DCA (Dollar Cost Averaging)</SelectItem>
                <SelectItem value="grid">Grid Trading</SelectItem>
                <SelectItem value="momentum">Momentum</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {config.strategy === 'simple' && "Βασική στρατηγική αγοράς σε χαμηλές τιμές και πώλησης σε υψηλότερες."}
              {config.strategy === 'advanced' && "Χρήση προχωρημένων τεχνικών δεικτών για εντοπισμό τάσεων."}
              {config.strategy === 'custom' && "Ρυθμίστε όλες τις παραμέτρους χειροκίνητα για προσαρμοσμένη στρατηγική."}
              {config.strategy === 'dca' && "Στρατηγική μέσης τιμής με περιοδικές αγορές."}
              {config.strategy === 'grid' && "Στρατηγική πλέγματος με εντολές σε διάφορα επίπεδα τιμών."}
              {config.strategy === 'momentum' && "Στρατηγική που βασίζεται στην ορμή της τιμής."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
