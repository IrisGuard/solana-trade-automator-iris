
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

export function useWalletStatus() {
  const { connected, connecting, publicKey, disconnect } = useWallet();
  const [isInitializing, setIsInitializing] = useState(true);

  // Αρχικοποίηση του state μετά από μικρή καθυστέρηση
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Check if user has previously connected wallet
  const wasConnected = localStorage.getItem('walletConnected') === 'true';

  useEffect(() => {
    // Αποθήκευση της κατάστασης σύνδεσης
    if (connected) {
      localStorage.setItem('walletConnected', 'true');
    }
  }, [connected]);

  // Αποσύνδεση του wallet αν χρειάζεται (αν το user έχει κάνει explicit disconnect)
  useEffect(() => {
    const userDisconnected = localStorage.getItem('userDisconnected') === 'true';
    
    if (userDisconnected && connected) {
      disconnect();
    }
  }, [connected, disconnect]);

  const handleDisconnect = () => {
    disconnect();
    localStorage.setItem('walletConnected', 'false');
    localStorage.setItem('userDisconnected', 'true');
  };

  return {
    isConnected: connected,
    isConnecting: connecting,
    isInitializing,
    wasConnected,
    walletAddress: publicKey?.toString() || null,
    disconnect: handleDisconnect,
  };
}
