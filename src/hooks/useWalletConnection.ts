
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect, useCallback } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { useTokens } from './useTokens';
import { isPhantomInstalled } from '@/utils/phantomWallet';

export function useWalletConnection() {
  const { connection } = useConnection();
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Use tokens hook
  const {
    tokens,
    isLoading: isLoadingTokens,
    error: tokensError,
    refreshTokens,
  } = useTokens();

  // Connect wallet
  const connectWallet = useCallback(() => {
    try {
      setVisible(true);
    } catch (err) {
      console.error('Error showing wallet modal:', err);
      toast.error('Error connecting wallet');
    }
  }, [setVisible]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
      setBalance(0);
      setError(null);
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Error disconnecting');
    }
  }, [disconnect]);

  // Fetch SOL balance with retries
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection) return;

    setIsLoadingBalance(true);
    try {
      console.log('Fetching SOL balance for:', publicKey.toString());
      const lamports = await connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      console.log('SOL balance fetched:', solBalance);
      setBalance(solBalance);
      setError(null);
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Error fetching balance');
      
      // Implement retry logic
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchBalance();
        }, 2000);
      }
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, connection, retryCount]);

  // Auto-fetch balance when connected
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      refreshTokens();
      toast.success('Wallet connected successfully');
    }
  }, [connected, publicKey, fetchBalance, refreshTokens]);

  // Refresh all wallet data with improved error handling
  const refreshWalletData = useCallback(async (walletAddress?: string) => {
    console.log('Refreshing wallet data...');
    try {
      await fetchBalance();
      await refreshTokens();
      console.log('Wallet data refreshed successfully');
      return true;
    } catch (err) {
      console.error('Error refreshing wallet data:', err);
      toast.error('Failed to refresh wallet data');
      return false;
    }
  }, [fetchBalance, refreshTokens]);

  return {
    // Wallet state
    publicKey,
    connected,
    connecting,
    balance,
    isLoadingBalance,
    tokens,
    isLoadingTokens,
    tokensError,
    error,
    isPhantomInstalled: isPhantomInstalled(),
    
    // Actions
    connectWallet,
    disconnectWallet,
    refreshBalance: fetchBalance,
    refreshTokens,
    refreshWalletData,
    
    // Computed values
    walletAddress: publicKey?.toString() || null,
    shortAddress: publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : null,
    
    // Aliases for compatibility
    isConnected: connected,
    isConnecting: connecting,
    solBalance: balance,
    tokenPrices: {},
    selectTokenForTrading: (tokenAddress: string) => {
      console.log('Selected token for trading:', tokenAddress);
    },
  };
}
