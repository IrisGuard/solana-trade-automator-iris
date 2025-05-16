
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { GradientBorder } from "@/components/ui/gradient-card";

interface ConnectivityStatusProps {
  connected: boolean;
}

export function ConnectivityStatus({ connected }: ConnectivityStatusProps) {
  const { connectWallet } = useWalletConnection();
  
  if (connected) {
    return (
      <GradientBorder variant="green">
        <div className="flex items-center p-3 rounded-md gap-2 bg-background">
          <Wifi className="h-4 w-4 text-emerald-500" />
          <p className="text-sm font-medium flex-1">
            Το πορτοφόλι είναι συνδεδεμένο
          </p>
        </div>
      </GradientBorder>
    );
  }

  return (
    <GradientBorder variant="amber">
      <div className="bg-amber-500/5 border-amber-400/10 p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-amber-400" />
          <AlertDescription className="text-sm font-medium">
            Παρακαλώ συνδέστε το πορτοφόλι σας για να χρησιμοποιήσετε το Trading Bot
          </AlertDescription>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/30 hover:bg-amber-500/30"
          onClick={connectWallet}
        >
          Σύνδεση Πορτοφολιού
        </Button>
      </div>
    </GradientBorder>
  );
}
