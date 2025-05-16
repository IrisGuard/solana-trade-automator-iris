
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

interface WalletConnectContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletConnectContext = createContext<WalletConnectContextType>({
  isConnected: false,
  isConnecting: false,
  walletAddress: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const useWalletConnect = () => useContext(WalletConnectContext);

export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  // Update wallet address when connected
  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString());
    } else {
      setWalletAddress(null);
    }
  }, [connected, publicKey]);

  const connectWallet = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    try {
      disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const value = {
    isConnected: connected,
    isConnecting: connecting,
    walletAddress,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletConnectContext.Provider value={value}>
      {children}
    </WalletConnectContext.Provider>
  );
}
