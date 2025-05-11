
import { useState, useEffect, useCallback } from 'react';
import { useWalletStatus } from './useWalletStatus';
import { useWalletBalance } from './useWalletBalance';
import { useTokens } from './useTokens';
import { useTransactions } from './useTransactions';

export function useWalletConnection() {
  const {
    walletAddress,
    balance,
    isConnected,
    isConnecting,
    error,
    isPhantomInstalled,
    connectWallet: connectWalletStatus,
    disconnectWallet: disconnectWalletStatus
  } = useWalletStatus();

  const { fetchAndSetBalance } = useWalletBalance();
  
  const {
    tokens,
    selectedToken,
    tokenPrices,
    isLoadingTokens,
    fetchAndSetTokens,
    selectTokenForTrading,
    fetchTokenPrices,
    setSelectedToken
  } = useTokens();

  const { transactions, isLoadingTransactions } = useTransactions(walletAddress);

  // Load token prices when connected
  useEffect(() => {
    if (isConnected && tokens.length > 0) {
      fetchTokenPrices();
      
      // Update prices every 60 seconds
      const interval = setInterval(fetchTokenPrices, 60000);
      return () => clearInterval(interval);
    }
  }, [isConnected, tokens, fetchTokenPrices]);

  // Connect wallet and fetch data
  const connectWallet = async () => {
    const address = await connectWalletStatus();
    if (address) {
      await fetchAndSetBalance(address);
      await fetchAndSetTokens(address);
    }
  };

  // Disconnect wallet and clear data
  const disconnectWallet = async () => {
    await disconnectWalletStatus();
    setSelectedToken(null);
  };

  // Derived SOL balance from state
  const solBalance = balance || 0;

  return {
    walletAddress,
    balance,
    solBalance,
    tokens,
    tokenPrices,
    selectedToken,
    transactions,
    isConnected,
    isConnecting,
    isLoadingTokens,
    isLoadingTransactions,
    error,
    isPhantomInstalled,
    connectWallet,
    disconnectWallet,
    selectTokenForTrading,
  };
}

// Re-export types for compatibility
export type { Token, Transaction } from '@/types/wallet';
