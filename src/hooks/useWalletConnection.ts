
import { useState, useEffect } from 'react';

export type Transaction = {
  signature: string;
  blockTime: number;
  type: string;
  status: string;
  amount: string;
  from: string;
  to: string;
};

export function useWalletConnection() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Check if Phantom is installed
        const phantom = window.phantom?.solana;
        
        if (phantom && phantom.isPhantom) {
          // Check if user is already connected
          const response = await phantom.connect({ onlyIfTrusted: true });
          
          if (response && response.publicKey) {
            setWalletAddress(response.publicKey.toString());
            await fetchBalance(response.publicKey.toString());
            setIsConnected(true);
          }
        }
      } catch (err) {
        console.log('No trusted connection:', err);
        // This is not an error, just means the user hasn't connected before
      }
    };

    checkWalletConnection();
  }, []);

  // Helper function to fetch balance
  const fetchBalance = async (address: string) => {
    try {
      const phantom = window.phantom?.solana;
      if (!phantom) return;

      // For demo purposes, we'll just set a mock balance
      // In a real app, you'd fetch this from the Solana blockchain
      setBalance(5.25);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch wallet balance');
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const phantom = window.phantom?.solana;

      if (!phantom) {
        setError('Phantom wallet not found! Please install it.');
        setIsConnecting(false);
        return;
      }

      const response = await phantom.connect();
      
      if (response && response.publicKey) {
        const address = response.publicKey.toString();
        setWalletAddress(address);
        await fetchBalance(address);
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const phantom = window.phantom?.solana;
      
      if (phantom && phantom.isPhantom) {
        await phantom.disconnect();
        setIsConnected(false);
        setWalletAddress('');
        setBalance(null);
      }
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    }
  };

  return {
    walletAddress,
    balance,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  };
}

// Add Phantom wallet type definitions
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom: boolean;
        connect: (options?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
        disconnect: () => Promise<void>;
      };
    };
  }
}
