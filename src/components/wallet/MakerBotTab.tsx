
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { BotSettings } from "./maker-bot/BotSettings";
import { PriceBoost } from "./maker-bot/PriceBoost";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";

interface MakerBotTabProps {
  isConnected: boolean;
  isSimulation: boolean;
  makers: number;
  minDelay: number;
  maxDelay: number;
  priceBoost: number;
  botActive: boolean;
  tokenAmount: number;
  solAmount: number;
  handleConnectWallet: () => void;
  toggleSimulation: () => void;
  setMakers: (value: number) => void;
  setMinDelay: (value: number) => void;
  setMaxDelay: (value: number) => void;
  setPriceBoost: (value: number) => void;
  setTokenAmount: (value: number) => void;
  setSolAmount: (value: number) => void;
  handleStartBot: () => void;
  handleStopBot: () => void;
  handleBoostPrice: () => void;
}

export function MakerBotTab({
  isConnected,
  isSimulation,
  makers,
  minDelay,
  maxDelay,
  priceBoost,
  botActive,
  tokenAmount,
  solAmount,
  handleConnectWallet,
  toggleSimulation,
  setMakers,
  setMinDelay,
  setMaxDelay,
  setPriceBoost,
  setTokenAmount,
  setSolAmount,
  handleStartBot,
  handleStopBot,
  handleBoostPrice
}: MakerBotTabProps) {
  return (
    <TabsContent value="maker-bot" className="space-y-4">
      {isConnected ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BotSettings
            isSimulation={isSimulation}
            makers={makers}
            minDelay={minDelay}
            maxDelay={maxDelay}
            tokenAmount={tokenAmount}
            solAmount={solAmount}
            botActive={botActive}
            toggleSimulation={toggleSimulation}
            setMakers={setMakers}
            setMinDelay={setMinDelay}
            setMaxDelay={setMaxDelay}
            setTokenAmount={setTokenAmount}
            setSolAmount={setSolAmount}
            handleStartBot={handleStartBot}
            handleStopBot={handleStopBot}
          />
          <PriceBoost
            isConnected={isConnected}
            priceBoost={priceBoost}
            botActive={botActive}
            setPriceBoost={setPriceBoost}
            handleBoostPrice={handleBoostPrice}
          />
        </div>
      ) : (
        <ConnectPrompt handleConnectWallet={handleConnectWallet} />
      )}
    </TabsContent>
  );
}
