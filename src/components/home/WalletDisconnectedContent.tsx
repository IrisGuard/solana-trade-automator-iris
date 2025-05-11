
import React from "react";
import { ConnectWalletCard } from "./ConnectWalletCard";
import { PlatformInfoCard } from "./PlatformInfoCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface WalletDisconnectedContentProps {
  isConnecting: boolean;
}

export function WalletDisconnectedContent({ 
  isConnecting
}: WalletDisconnectedContentProps) {
  return (
    <div className="space-y-6">
      {/* Grid content */}
      <div className="grid md:grid-cols-2 gap-6">
        <ConnectWalletCard 
          isConnecting={isConnecting}
        />
        <PlatformInfoCard />
      </div>
    </div>
  );
}
