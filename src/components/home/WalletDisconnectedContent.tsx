
import React from "react";
import { ConnectWalletCard } from "./ConnectWalletCard";
import { PlatformInfoCard } from "./PlatformInfoCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface WalletDisconnectedContentProps {
  isConnecting: boolean;
  isPhantomInstalled?: boolean;
  handleConnectWallet?: () => void;
}

export function WalletDisconnectedContent({ 
  isConnecting,
  isPhantomInstalled = true,
  handleConnectWallet
}: WalletDisconnectedContentProps) {
  return (
    <div className="space-y-6">
      {!isPhantomInstalled && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Το Phantom Wallet δεν είναι εγκατεστημένο. Παρακαλώ εγκαταστήστε το για να συνδεθείτε.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Grid content */}
      <div className="grid md:grid-cols-2 gap-6">
        <ConnectWalletCard 
          isConnecting={isConnecting}
          isPhantomInstalled={isPhantomInstalled}
          handleConnectWallet={handleConnectWallet}
        />
        <PlatformInfoCard />
      </div>
    </div>
  );
}
