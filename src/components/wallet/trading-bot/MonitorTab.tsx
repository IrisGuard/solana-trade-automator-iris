
import React from "react";
import { StatusCard } from "./StatusCard"; 
import { TradingOrder } from "@/hooks/trading-bot/types";
import { Token } from "@/types/wallet";

interface MonitorTabProps {
  botStatus: 'idle' | 'running' | 'paused';
  selectedTokenDetails: Token | undefined;
  selectedTokenPrice: { price: number; priceChange24h: number } | null;
  activeOrders: TradingOrder[];
}

export function MonitorTab({
  botStatus,
  selectedTokenDetails,
  selectedTokenPrice,
  activeOrders
}: MonitorTabProps) {
  return (
    <div className="space-y-6">
      <StatusCard 
        botStatus={botStatus}
        selectedTokenDetails={selectedTokenDetails}
        selectedTokenPrice={selectedTokenPrice}
        activeOrders={activeOrders}
      />
    </div>
  );
}
