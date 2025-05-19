
import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { JupiterSwapForm } from "./swap/JupiterSwapForm";
import { RaydiumSwapForm } from "./swap/RaydiumSwapForm";
import { SwapTransactionsHistory } from "./swap/SwapTransactionsHistory";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { SwapFormProps } from "./swap/types";

interface SwapTabProps {
  isConnected: boolean;
}

export function SwapTab({ isConnected }: SwapTabProps) {
  const [swapService, setSwapService] = useState<"jupiter" | "raydium">("jupiter");
  const { connectWallet } = useWalletConnection();

  // Create a props object that matches the SwapFormProps interface
  const swapFormProps: SwapFormProps = {
    isConnected: isConnected,
    connectWallet: connectWallet
  };

  return (
    <TabsContent value="swap" className="space-y-6">
      {!isConnected ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to use the Swap feature
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <ToggleGroup type="single" value={swapService} onValueChange={(value) => value && setSwapService(value as "jupiter" | "raydium")}>
              <ToggleGroupItem value="jupiter" aria-label="Jupiter Swap" className="px-6">
                Jupiter
              </ToggleGroupItem>
              <ToggleGroupItem value="raydium" aria-label="Raydium Swap" className="px-6">
                Raydium
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              {swapService === "jupiter" ? (
                <JupiterSwapForm 
                  isConnected={isConnected}
                  connectWallet={connectWallet}
                />
              ) : (
                <RaydiumSwapForm 
                  isConnected={isConnected}
                  connectWallet={connectWallet}
                />
              )}
            </div>
            <div>
              <SwapTransactionsHistory selectedService={swapService} />
            </div>
          </div>
        </>
      )}
    </TabsContent>
  );
}
