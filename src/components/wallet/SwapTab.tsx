
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

interface SwapTabProps {
  isConnected: boolean;
}

export function SwapTab({ isConnected }: SwapTabProps) {
  const [swapService, setSwapService] = useState<"jupiter" | "raydium">("jupiter");

  return (
    <TabsContent value="swap" className="space-y-6">
      {!isConnected ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Παρακαλώ συνδέστε το πορτοφόλι σας για να χρησιμοποιήσετε το Swap
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <ToggleGroup type="single" value={swapService} onValueChange={(value) => value && setSwapService(value as "jupiter" | "raydium")}>
              <ToggleGroupItem value="jupiter" aria-label="Jupiter Swap">
                Jupiter
              </ToggleGroupItem>
              <ToggleGroupItem value="raydium" aria-label="Raydium Swap">
                Raydium
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              {swapService === "jupiter" ? (
                <JupiterSwapForm />
              ) : (
                <RaydiumSwapForm />
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
