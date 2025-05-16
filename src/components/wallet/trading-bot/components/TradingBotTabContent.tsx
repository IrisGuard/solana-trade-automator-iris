
import React from "react";
import { MonitorTab } from "../MonitorTab";
import { OrdersTab } from "../OrdersTab";
import { HistoryTab } from "../HistoryTab";
import { TradingBotSettingsForm } from "./TradingBotSettingsForm";
import { TradingBotConfig, TradingOrder } from "@/hooks/trading-bot/types";
import { Token } from "@/types/wallet";

interface TradingBotTabContentProps {
  activeTab: string;
  botStatus: 'idle' | 'running' | 'paused' | 'error';
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  selectToken: (tokenAddress: string | null) => void;
  startBot: () => void;
  stopBot: () => void;
  isLoading: boolean;
  tokens: Token[];
  activeOrders: TradingOrder[];
  selectedTokenPrice: any;
  selectedTokenDetails: Token | undefined;
}

export function TradingBotTabContent({
  activeTab,
  botStatus,
  config,
  updateConfig,
  selectToken,
  startBot,
  stopBot,
  isLoading,
  tokens,
  activeOrders,
  selectedTokenPrice,
  selectedTokenDetails
}: TradingBotTabContentProps) {
  // Convert BotStatus to the expected type for components
  const safeStatus = botStatus === 'error' ? 'idle' : botStatus as 'idle' | 'running' | 'paused';

  switch (activeTab) {
    case "monitor":
      return (
        <MonitorTab
          botStatus={safeStatus}
          selectedTokenDetails={selectedTokenDetails}
          selectedTokenPrice={selectedTokenPrice}
          activeOrders={activeOrders}
        />
      );
    case "orders":
      return <OrdersTab activeOrders={activeOrders} />;
    case "history":
      return <HistoryTab />;
    case "settings":
    default:
      return (
        <TradingBotSettingsForm
          config={config}
          updateConfig={updateConfig}
          selectToken={selectToken}
          startBot={startBot}
          stopBot={stopBot}
          isLoading={isLoading}
          botStatus={botStatus}
          tokens={tokens}
        />
      );
  }
}
