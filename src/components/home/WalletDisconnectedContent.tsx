
import React from "react";
import { ConnectWalletCard } from "./ConnectWalletCard";
import { PlatformInfoCard } from "./PlatformInfoCard";

interface WalletDisconnectedContentProps {
  connectWallet: () => void;
}

export function WalletDisconnectedContent({ connectWallet }: WalletDisconnectedContentProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ConnectWalletCard connectWallet={connectWallet} />
      <PlatformInfoCard />
    </div>
  );
}
