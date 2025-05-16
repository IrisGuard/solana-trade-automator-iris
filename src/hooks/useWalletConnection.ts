
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useErrorReporting } from './useErrorReporting';
import { useSolanaWallet } from './useSolanaWallet';
import { Token } from '@/types/wallet';
import { walletService } from '@/services/walletService';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { useWalletData } from './wallet/useWalletData';

export function useWalletConnection() {
  const { address, connected, connecting, balance, refreshBalance, connectWallet: connectSolana, disconnectWallet } = useSolanaWallet();
  const { user } = useAuth();
  const { tokens, tokenPrices, isLoadingTokens, loadWalletData, selectTokenForTrading } = useWalletData();
  const [error, setError] = useState<string | null>(null);
  const { reportError } = useErrorReporting();

  // Check if Phantom is installed
  const isPhantomInstalled = useCallback(() => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      return provider?.isPhantom || false;
    }
    return false;
  }, []);

  // Connect to wallet
  const connectWallet = useCallback(async () => {
    try {
      setError(null);
      
      if (!isPhantomInstalled()) {
        const errorMessage = 'Please install Phantom Wallet extension';
        setError(errorMessage);
        toast.error('Phantom wallet not detected', {
          description: 'Please install the Phantom browser extension',
        });
        return;
      }

      await connectSolana('phantom');
      
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      if (err instanceof Error) {
        setError(err.message);
        reportError(err, {
          component: 'WalletConnection', 
          source: 'client',
          details: { action: 'connectWallet' }
        });
      }
    }
  }, [isPhantomInstalled, connectSolana, reportError]);

  // Refresh wallet data
  const refreshWalletData = useCallback(async () => {
    if (!address) return;
    
    try {
      // Refresh SOL balance
      await refreshBalance();
      
      // Load tokens and prices
      await loadWalletData(address);
      
      toast.success('Τα δεδομένα του πορτοφολιού ανανεώθηκαν');
    } catch (err) {
      console.error('Failed to refresh wallet data:', err);
      if (err instanceof Error) {
        reportError(err, {
          component: 'WalletConnection',
          source: 'client',
          details: { action: 'refreshWalletData' }
        });
      }
    }
  }, [address, refreshBalance, loadWalletData, reportError]);

  // Save wallet to database when connected
  useEffect(() => {
    const saveWalletData = async () => {
      if (connected && address && user?.id && tokens.length > 0) {
        try {
          // Save to Supabase
          await walletService.saveWalletToDatabase(user.id, address, tokens);
          
          // Create initial transaction record if needed
          await walletService.createInitialTransaction(user.id, address);
          
          // Save to localStorage for quick reconnect
          localStorage.setItem('phantom_wallet', JSON.stringify({
            address,
            timestamp: Date.now()
          }));
        } catch (err) {
          console.error('Error saving wallet data:', err);
        }
      }
    };
    
    saveWalletData();
  }, [connected, address, user?.id, tokens]);

  // Load tokens when wallet is connected
  useEffect(() => {
    if (connected && address) {
      loadWalletData(address);
    }
  }, [connected, address, loadWalletData]);

  return {
    isConnected: connected,
    isConnecting: connecting,
    walletAddress: address,
    solBalance: balance || 0,
    tokens,
    tokenPrices,
    isLoadingTokens,
    error,
    isPhantomInstalled: isPhantomInstalled(),
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading
  };
}
