
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { JupiterSwapForm } from "./swap/JupiterSwapForm";
import { SwapTransactionsHistory } from "./swap/SwapTransactionsHistory";

interface SwapTabProps {
  isConnected: boolean;
}

export function SwapTab({ isConnected }: SwapTabProps) {
  return (
    <TabsContent value="swap" className="space-y-6">
      {!isConnected ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Παρακαλώ συνδέστε το πορτοφόλι σας για να χρησιμοποιήσετε το Jupiter Swap
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <JupiterSwapForm />
          </div>
          <div>
            <SwapTransactionsHistory />
          </div>
        </div>
      )}
    </TabsContent>
  );
}
