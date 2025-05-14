
import React from "react";
import { useWallet } from "@/hooks/useWallet";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";

export default function HomePage() {
  const { 
    isConnected, 
    isConnecting, 
    walletAddress, 
    connectWallet, 
    disconnectWallet,
    tokens
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {isConnected ? "Dashboard" : "Welcome"}
        </h2>
      </div>

      <div className="space-y-6">
        {isConnected ? (
          <WalletConnectedContent 
            walletAddress={walletAddress}
            tokens={tokens}
            onDisconnect={handleDisconnect}
          />
        ) : (
          <WalletDisconnectedContent 
            onConnect={handleConnect}
            isConnecting={isConnecting}
          />
        )}
      </div>
    </div>
  );
}
