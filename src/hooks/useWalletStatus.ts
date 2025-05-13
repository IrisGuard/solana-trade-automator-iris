
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { handleWalletError, checkPhantomWalletInstalled } from '@/utils/walletUtils';

export function useWalletStatus() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Remove auto-connection on startup
  useEffect(() => {
    const checkWalletConnection = async () => {
      // Only check if the wallet exists, don't try to connect
      if (typeof window === 'undefined') return;
      
      try {
        const phantom = window.phantom?.solana;
        if (phantom && phantom.isPhantom) {
          console.log('Phantom is installed but not auto-connecting');
        }
      } catch (err) {
        console.log('No wallet connection');
      }
      return null;
    };

    checkWalletConnection();
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const phantom = window.phantom?.solana;

      if (!phantom) {
        const errorMsg = 'Το Phantom wallet δεν βρέθηκε! Παρακαλώ εγκαταστήστε το.';
        setError(errorMsg);
        toast.error(errorMsg);
        setIsConnecting(false);
        return null;
      }

      toast.loading('Σύνδεση με το Phantom wallet...');
      
      const response = await phantom.connect();
      
      if (response && response.publicKey) {
        const address = response.publicKey.toString();
        console.log('Connected to wallet:', address);
        setWalletAddress(address);
        setIsConnected(true);
        toast.success('Το πορτοφόλι συνδέθηκε επιτυχώς');
        return address;
      }
      return null;
    } catch (err) {
      console.error('Connection error:', err);
      const errorMsg = handleWalletError(err);
      setError(errorMsg);
      return null;
    } finally {
      setIsConnecting(false);
      toast.dismiss();
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      const phantom = window.phantom?.solana;
      
      if (phantom && phantom.isPhantom) {
        toast.loading('Αποσύνδεση πορτοφολιού...');
        await phantom.disconnect();
        setIsConnected(false);
        setWalletAddress('');
        setBalance(null);
        toast.success('Το πορτοφόλι αποσυνδέθηκε');
      }
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      const errorMsg = 'Αποτυχία αποσύνδεσης πορτοφολιού';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      toast.dismiss();
    }
  }, []);

  return {
    walletAddress,
    balance,
    setBalance,
    isConnected,
    isConnecting,
    error,
    isPhantomInstalled: checkPhantomWalletInstalled(),
    connectWallet,
    disconnectWallet
  };
}
