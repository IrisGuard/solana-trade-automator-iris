
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader } from "lucide-react";
import { SettingsTab } from "./SettingsTab";
import { Button } from "@/components/ui/button";
import { TradingBotConfig } from "@/hooks/trading-bot/types";
import { Token } from "@/types/wallet";

interface EnhancedPanelProps {
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  selectToken: (token: string | null) => Promise<void>;
  selectedTokenPrice: any;
  selectedTokenDetails: Token | undefined;
  tokens: Token[];
  isLoading: boolean;
  botStatus: string;
  startBot: () => void;
  stopBot: () => void;
}

export function EnhancedPanel({
  config,
  updateConfig,
  selectToken,
  selectedTokenPrice,
  selectedTokenDetails,
  tokens,
  isLoading,
  botStatus,
  startBot,
  stopBot
}: EnhancedPanelProps) {
  return (
    <div className="space-y-4">
      <SettingsTab
        config={config}
        updateConfig={updateConfig}
        selectToken={selectToken}
        selectedTokenPrice={selectedTokenPrice}
        selectedTokenDetails={selectedTokenDetails}
        tokens={tokens}
      />
      
      {config.selectedToken && (
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={startBot}
            disabled={isLoading || botStatus === 'running' || !config.selectedToken}
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Εκκίνηση Bot
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={stopBot}
            disabled={isLoading || botStatus !== 'running'}
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Διακοπή Bot
          </Button>
        </div>
      )}
    </div>
  );
}
