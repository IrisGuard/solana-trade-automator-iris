
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const wasConnected = localStorage.getItem('walletConnected') === 'true';

  const refreshBalance = useCallback(async () => {
    if (!publicKey || isRefreshingBalance) return;
    
    const now = Date.now();
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
        component: 'useWalletStatus'
      });
    } finally {
      setIsRefreshingBalance(false);
    }
  }, [publicKey, lastBalanceCheck, isRefreshingBalance]);

  useEffect(() => {
    if (connected && publicKey) {
      refreshBalance();
      
      try {
        localStorage.setItem('walletConnected', 'true');
      } catch (err) {
        console.error('Error saving wallet connection state:', err);
      }
    } else if (!connected) {
      setBalance(null);
    }
  }, [connected, publicKey, refreshBalance]);

  useEffect(() => {
    try {
      const userDisconnected = localStorage.getItem('userDisconnected') === 'true';
      
      if (userDisconnected && connected) {
        disconnect();
      }
    } catch (err) {
      console.error('Error handling disconnect state:', err);
      errorCollector.captureError(err, {
        component: 'useWalletStatus'
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
        component: 'useWalletStatus'
      });
      toast.error('Failed to disconnect wallet');
    }
  }, [disconnect]);

  const isPhantomInstalled = typeof window !== 'undefined' && 
    window.phantom?.solana?.isPhantom || false;

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
      return publicKey?.toString() || null;
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect wallet');
      errorCollector.captureError(err, {
        component: 'useWalletStatus'
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
