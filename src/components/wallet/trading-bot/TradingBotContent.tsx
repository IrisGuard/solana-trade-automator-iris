
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { TradingBotHook } from "@/hooks/trading-bot/types";
import { TradingBotNav } from "./components/TradingBotNav";
import { TradingBotHeader } from "./components/TradingBotHeader";
import { TradingBotTabContent } from "./components/TradingBotTabContent";
import { ConnectivityStatus } from "./components/ConnectivityStatus";

interface TradingBotContentProps {
  tradingBotState: TradingBotHook;
  tab: string;
  setTab: (tab: string) => void;
}

export function TradingBotContent({ tradingBotState, tab, setTab }: TradingBotContentProps) {
  const { 
    config, 
    updateConfig, 
    startBot, 
    stopBot, 
    selectToken,
    isLoading,
    botStatus,
    tokens,
    connected,
    activeOrders,
    selectedTokenPrice,
    selectedTokenDetails
  } = tradingBotState;

  if (!connected) {
    return <ConnectivityStatus connected={connected} />;
  }

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TradingBotNav activeTab={tab} onTabChange={setTab} />

        <Card>
          <TradingBotHeader activeTab={tab} botStatus={botStatus} />
          <CardContent>
            <TradingBotTabContent
              activeTab={tab}
              botStatus={botStatus}
              config={config}
              updateConfig={updateConfig}
              selectToken={selectToken}
              startBot={startBot}
              stopBot={stopBot}
              isLoading={isLoading}
              tokens={tokens}
              activeOrders={activeOrders}
              selectedTokenPrice={selectedTokenPrice}
              selectedTokenDetails={selectedTokenDetails}
            />
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
