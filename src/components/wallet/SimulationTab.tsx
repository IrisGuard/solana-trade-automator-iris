
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { BacktestingCard } from "./simulation/BacktestingCard";
import { SimulationSettingsCard } from "./simulation/SimulationSettingsCard";
import { SimulationResultsCard } from "./simulation/SimulationResultsCard";

export function SimulationTab() {
  return (
    <TabsContent value="simulation" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BacktestingCard />
        <SimulationSettingsCard />
      </div>
      
      <SimulationResultsCard />
    </TabsContent>
  );
}
