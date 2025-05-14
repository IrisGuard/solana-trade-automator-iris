
import React from "react";
import { StatusCard } from "./StatusCard";
import { AdvancedStrategiesCard } from "./AdvancedStrategiesCard";
import { PerformanceHistoryCard } from "./PerformanceHistoryCard";
import { Separator } from "@/components/ui/separator";

interface EnhancedStatusPanelProps {
  botStatus: string;
  selectedTokenDetails: any;
  selectedTokenPrice: any;
  activeOrders: any[];
}

export function EnhancedStatusPanel({
  botStatus,
  selectedTokenDetails,
  selectedTokenPrice,
  activeOrders
}: EnhancedStatusPanelProps) {
  return (
    <>
      <StatusCard
        botStatus={botStatus}
        selectedTokenDetails={selectedTokenDetails}
        selectedTokenPrice={selectedTokenPrice}
        activeOrders={activeOrders}
      />
      
      <Separator className="my-6" />
      
      <div className="space-y-6">
        <AdvancedStrategiesCard isActive={botStatus !== 'idle'} />
        <PerformanceHistoryCard />
      </div>
    </>
  );
}
