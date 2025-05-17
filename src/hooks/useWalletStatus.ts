
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import { solanaService } from '@/services/solanaService';

export function useWalletStatus() {
  const { connected, connecting, publicKey, disconnect } = useWallet();
  const [isInitializing, setIsInitializing] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastBalanceCheck, setLastBalanceCheck] = useState(0);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

  // Αρχικοποίηση του state μετά από μικρή καθυστέρηση
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Check if user has previously connected wallet
  const wasConnected = localStorage.getItem('walletConnected') === 'true';

  // Refresh balance with throttling
  const refreshBalance = useCallback(async () => {
    if (!publicKey || isRefreshingBalance) return;
    
    const now = Date.now();
    // Don't refresh more than once every 10 seconds
    if (now - lastBalanceCheck < 10000) {
      console.log('Skipping balance refresh (throttled)');
      return;
    }
    
    setIsRefreshingBalance(true);
    setLastBalanceCheck(now);
    
    try {
      console.log('Refreshing SOL balance');
      const solBalance = await solanaService.getSOLBalance(publicKey.toString());
      setBalance(solBalance);
    } catch (err) {
      console.error('Error refreshing balance:', err);
      errorCollector.captureError(err, {
        component: 'useWalletStatus', 
        method: 'refreshBalance'
      });
      
      // Don't set error state here to avoid UI disruption
    } finally {
      setIsRefreshingBalance(false);
    }
  }, [publicKey, lastBalanceCheck, isRefreshingBalance]);

  // Load balance when wallet connects or changes
  useEffect(() => {
    if (connected && publicKey) {
      refreshBalance();
      
      // Αποθήκευση της κατάστασης σύνδεσης
      try {
        localStorage.setItem('walletConnected', 'true');
      } catch (err) {
        console.error('Error saving wallet connection state:', err);
      }
    } else if (!connected) {
      setBalance(null);
    }
  }, [connected, publicKey, refreshBalance]);

  // Αποσύνδεση του wallet αν χρειάζεται (αν το user έχει κάνει explicit disconnect)
  useEffect(() => {
    try {
      const userDisconnected = localStorage.getItem('userDisconnected') === 'true';
      
      if (userDisconnected && connected) {
        disconnect();
      }
    } catch (err) {
      console.error('Error handling disconnect state:', err);
      errorCollector.captureError(err, {
        component: 'useWalletStatus', 
        method: 'handleDisconnectState'
      });
    }
  }, [connected, disconnect]);

  const handleDisconnect = useCallback(() => {
    try {
      disconnect();
      localStorage.setItem('walletConnected', 'false');
      localStorage.setItem('userDisconnected', 'true');
      toast.success('Wallet disconnected successfully');
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Αποτυχία αποσύνδεσης πορτοφολιού');
      errorCollector.captureError(err, {
        component: 'useWalletStatus', 
        method: 'handleDisconnect'
      });
      toast.error('Failed to disconnect wallet');
    }
  }, [disconnect]);

  // Detect and handle Phantom installation status
  const isPhantomInstalled = typeof window !== 'undefined' && 
    window.phantom?.solana?.isPhantom || false;

  // Connect wallet with error handling
  const connectWallet = useCallback(async () => {
    if (!isPhantomInstalled) {
      setError('Phantom wallet is not installed');
      toast.error('Phantom wallet is not installed', {
        description: 'Please install Phantom to connect your wallet',
        action: {
          label: 'Install',
          onClick: () => window.open('https://phantom.app', '_blank')
        }
      });
      return null;
    }
    
    try {
      localStorage.removeItem('userDisconnected');
      // In actual implementation this would connect via wallet adapter
      // For now just return publicKey if already connected
      return publicKey?.toString() || null;
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect wallet');
      errorCollector.captureError(err, {
        component: 'useWalletStatus', 
        method: 'connectWallet'
      });
      toast.error('Failed to connect wallet');
      return null;
    }
  }, [isPhantomInstalled, publicKey]);

  return {
    isConnected: connected,
    isConnecting: connecting,
    isInitializing,
    wasConnected,
    walletAddress: publicKey?.toString() || null,
    disconnect: handleDisconnect,
    balance,
    refreshBalance,
    setBalance,
    error,
    setError,
    isPhantomInstalled,
    connectWallet,
    disconnectWallet: handleDisconnect
  };
}
