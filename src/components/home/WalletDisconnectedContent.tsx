
import React from "react";
import { ConnectWalletCard } from "./ConnectWalletCard";
import { PlatformInfoCard } from "./PlatformInfoCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface WalletDisconnectedContentProps {
  connectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
  isPhantomInstalled: boolean;
}

export function WalletDisconnectedContent({ 
  connectWallet, 
  isConnecting, 
  error,
  isPhantomInstalled 
}: WalletDisconnectedContentProps) {
  return (
    <div className="space-y-6">
      {/* Error message if any */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Warning if Phantom is not installed */}
      {!isPhantomInstalled && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-100">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Το Phantom Wallet δεν είναι εγκατεστημένο. 
            <a 
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-1 font-medium"
            >
              Εγκαταστήστε το από εδώ
            </a>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Grid content */}
      <div className="grid md:grid-cols-2 gap-6">
        <ConnectWalletCard 
          connectWallet={connectWallet} 
          isConnecting={isConnecting} 
          isPhantomInstalled={isPhantomInstalled} 
        />
        <PlatformInfoCard />
      </div>
    </div>
  );
}
