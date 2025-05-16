
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TradingBotConfig } from "@/hooks/trading-bot/types";
import { Token } from "@/types/wallet";

interface TradingBotSettingsFormProps {
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  selectToken: (tokenAddress: string | null) => void;
  startBot: () => void;
  stopBot: () => void;
  isLoading: boolean;
  botStatus: string;
  tokens: Token[];
}

export function TradingBotSettingsForm({ 
  config, 
  updateConfig, 
  selectToken, 
  startBot, 
  stopBot, 
  isLoading, 
  botStatus, 
  tokens 
}: TradingBotSettingsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (botStatus === 'running') {
      stopBot();
    } else {
      startBot();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Token Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Token</label>
            <select
              className="w-full p-2 border rounded-md"
              value={config.selectedToken || ''}
              onChange={(e) => selectToken(e.target.value || null)}
              disabled={isLoading || botStatus === 'running'}
            >
              <option value="">Επιλέξτε Token</option>
              {tokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol} - {token.name} ({token.amount})
                </option>
              ))}
            </select>
          </div>

          {/* Strategy Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Στρατηγική</label>
            <select
              className="w-full p-2 border rounded-md"
              value={config.strategy}
              onChange={(e) => updateConfig({ strategy: e.target.value as any })}
              disabled={isLoading || botStatus === 'running'}
            >
              <option value="simple">Simple - Απλή στρατηγική</option>
              <option value="advanced">Advanced - Προηγμένη στρατηγική</option>
              <option value="dca">DCA - Dollar-cost Averaging</option>
              <option value="grid">Grid - Πλέγμα εντολών</option>
              <option value="momentum">Momentum - Ανίχνευση τάσης</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {/* Trade Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ποσό Συναλλαγής: {config.tradeAmount}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={config.tradeAmount}
              onChange={(e) => updateConfig({ tradeAmount: Number(e.target.value) })}
              disabled={isLoading || botStatus === 'running'}
              className="w-full"
            />
          </div>

          {/* Stop Loss */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Stop Loss (%): {config.stopLoss}%</label>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={config.stopLoss}
              onChange={(e) => updateConfig({ stopLoss: Number(e.target.value) })}
              disabled={isLoading || botStatus === 'running'}
              className="w-full"
            />
          </div>

          {/* Take Profit */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Take Profit (%): {config.takeProfit}%</label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={config.takeProfit}
              onChange={(e) => updateConfig({ takeProfit: Number(e.target.value) })}
              disabled={isLoading || botStatus === 'running'}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="submit" 
          disabled={isLoading || !config.selectedToken} 
          variant={botStatus === 'running' ? "destructive" : "default"}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Επεξεργασία...</span>
            </>
          ) : (
            <span>{botStatus === 'running' ? 'Διακοπή Bot' : 'Εκκίνηση Bot'}</span>
          )}
        </Button>
      </div>
    </form>
  );
}
