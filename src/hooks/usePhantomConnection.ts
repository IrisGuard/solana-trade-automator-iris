
import { useState, useEffect } from 'react';
import { isPhantomInstalled } from '@/utils/phantomWallet';

export function usePhantomConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (isPhantomInstalled()) {
        try {
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          if (resp.publicKey) {
            setIsConnected(true);
            setWalletAddress(resp.publicKey.toString());
          }
        } catch (err) {
          // User is not connected
        }
      }
    };

    checkConnection();
  }, []);

  const connect = async () => {
    if (!isPhantomInstalled()) return;
    
    setIsConnecting(true);
    try {
      const resp = await window.solana.connect();
      setIsConnected(true);
      setWalletAddress(resp.publicKey.toString());
    } catch (err) {
      console.error('Failed to connect:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (window.solana) {
      await window.solana.disconnect();
      setIsConnected(false);
      setWalletAddress(null);
    }
  };

  return {
    isConnected,
    isConnecting,
    walletAddress,
    connect,
    disconnect
  };
}
