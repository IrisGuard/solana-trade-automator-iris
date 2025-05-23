
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect, useCallback } from 'react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';
import { useTokens } from './useTokens';

export function useWalletConnection() {
  const { connection } = useConnection();
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  
  // Use tokens hook
  const {
    tokens,
    isLoading: isLoadingTokens,
    error: tokensError,
    refreshTokens,
  } = useTokens();

  // Connect wallet
  const connectWallet = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
      setBalance(0);
      toast.success('Το πορτοφόλι αποσυνδέθηκε');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Σφάλμα κατά την αποσύνδεση');
    }
  }, [disconnect]);

  // Fetch SOL balance
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection) return;

    setIsLoadingBalance(true);
    try {
      const lamports = await connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error('Σφάλμα κατά τη λήψη υπολοίπου');
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, connection]);

  // Auto-fetch balance when connected
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      refreshTokens();
      toast.success('Το πορτοφόλι συνδέθηκε επιτυχώς');
    }
  }, [connected, publicKey, fetchBalance, refreshTokens]);

  // Refresh all wallet data
  const refreshWalletData = useCallback(async () => {
    await fetchBalance();
    await refreshTokens();
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
