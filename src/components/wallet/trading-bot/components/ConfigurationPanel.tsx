
import React from "react";
import { SettingsTab } from "../SettingsTab";
import { BotActionButtons } from "./BotActionButtons";
import { Token } from "@/types/wallet";
import { TradingBotConfig } from "@/hooks/trading-bot/types";

interface ConfigurationPanelProps {
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

export function ConfigurationPanel({
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
}: ConfigurationPanelProps) {
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
        <BotActionButtons
          isLoading={isLoading}
          botStatus={botStatus}
          hasSelectedToken={!!config.selectedToken}
          startBot={startBot}
          stopBot={stopBot}
        />
      )}
    </div>
  );
}
