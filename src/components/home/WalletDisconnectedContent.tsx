import React from "react";
import { ConnectWalletCard } from "./ConnectWalletCard";
import { PlatformInfoCard } from "./PlatformInfoCard";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletDisconnectedContentProps {
  connectWallet: () => void;
}

export function WalletDisconnectedContent({ connectWallet }: WalletDisconnectedContentProps) {
  return (
    <div className="space-y-6">
      {/* Prominent Connect Wallet Button at the top */}
      <div className="flex justify-center py-4 mb-4">
        <Button 
          onClick={connectWallet} 
          size="lg" 
          className="px-8 py-6 text-lg flex items-center gap-3"
        >
          <Wallet className="h-6 w-6" />
          Σύνδεση με Phantom Wallet
        </Button>
      </div>
      
      {/* Existing grid content */}
      <div className="grid md:grid-cols-2 gap-6">
        <ConnectWalletCard connectWallet={connectWallet} />
        <PlatformInfoCard />
      </div>
    </div>
  );
}
