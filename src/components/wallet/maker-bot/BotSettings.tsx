
import React from "react";
import { Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationToggle } from "./bot-settings/SimulationToggle";
import { MakersCountSetting } from "./bot-settings/MakersCountSetting";
import { DelaySettings } from "./bot-settings/DelaySettings";
import { TradeAmountSettings } from "./bot-settings/TradeAmountSettings";
import { DexSelector } from "./bot-settings/DexSelector";
import { BotActionButton } from "./bot-settings/BotActionButton";

interface BotSettingsProps {
  isSimulation: boolean;
  makers: number;
  minDelay: number;
  maxDelay: number;
  tokenAmount: number;
  solAmount: number;
  botActive: boolean;
  toggleSimulation: () => void;
  setMakers: (value: number) => void;
  setMinDelay: (value: number) => void;
  setMaxDelay: (value: number) => void;
  setTokenAmount: (value: number) => void;
  setSolAmount: (value: number) => void;
  handleStartBot: () => void;
  handleStopBot: () => void;
}

export function BotSettings({
  isSimulation,
  makers,
  minDelay,
  maxDelay,
  tokenAmount,
  solAmount,
  botActive,
  toggleSimulation,
  setMakers,
  setMinDelay,
  setMaxDelay,
  setTokenAmount,
  setSolAmount,
  handleStartBot,
  handleStopBot
}: BotSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Maker Bot Settings
        </CardTitle>
        <CardDescription>Configure trading parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <SimulationToggle 
            isSimulation={isSimulation} 
            toggleSimulation={toggleSimulation} 
          />
          
          <MakersCountSetting 
            makers={makers} 
            setMakers={setMakers} 
            disabled={botActive} 
          />

          <DelaySettings 
            minDelay={minDelay}
            maxDelay={maxDelay}
            setMinDelay={setMinDelay}
            setMaxDelay={setMaxDelay}
            disabled={botActive}
          />

          <TradeAmountSettings
            tokenAmount={tokenAmount}
            solAmount={solAmount}
            setTokenAmount={setTokenAmount}
            setSolAmount={setSolAmount}
            disabled={botActive}
          />

          <DexSelector disabled={botActive} />

          <BotActionButton 
            botActive={botActive}
            handleStartBot={handleStartBot}
            handleStopBot={handleStopBot}
          />
        </div>
      </CardContent>
    </Card>
  );
}
