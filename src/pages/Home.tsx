
import React, { useState, useCallback } from "react";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { toast } from "sonner";

export default function HomePage() {
  const { isConnected, isConnecting, connectWallet, disconnectWallet } = useWalletConnection();
  const [isLoading, setIsLoading] = useState(false);
  const { reportError } = useErrorReporting();
  
  const handleConnect = useCallback(async () => {
    if (isConnecting || isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Call the connect function from the hook
      const success = await connectWallet();
      
      if (success) {
        toast.success("Wallet connected successfully");
      } else {
        toast.error("Failed to connect wallet");
      }

      // Return void to match the Promise<void> type
      return;
    } catch (error) {
      reportError(error as Error, {
        component: 'HomePage',
        source: 'wallet',
        showToast: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [connectWallet, isConnecting, isLoading, reportError]);
  
  const handleDisconnect = useCallback(() => {
    disconnectWallet();
    toast.info("Wallet disconnected");
  }, [disconnectWallet]);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Solana Trading Dashboard</h1>
      
      {isConnected ? (
        <WalletConnectedContent onDisconnect={handleDisconnect} />
      ) : (
        <WalletDisconnectedContent 
          onConnect={handleConnect}
          isConnecting={isConnecting || isLoading}
        />
      )}
    </div>
  );
}
