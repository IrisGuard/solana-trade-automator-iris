
import { useState, useEffect, useCallback } from 'react';
import { useWalletStatus } from './useWalletStatus';
import { useWalletBalance } from './useWalletBalance';
import { useTokens } from './useTokens';
import { useTransactions } from './useTransactions';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { walletService } from '@/services/walletService';

export function useWalletConnection() {
  const { user } = useAuth();
  
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

  const { 
    transactions, 
    isLoadingTransactions,
    refreshTransactions 
  } = useTransactions(walletAddress);

  // Save wallet to database when connected and user is logged in
  useEffect(() => {
    const saveWalletIfLoggedIn = async () => {
      if (isConnected && walletAddress && user?.id) {
        await walletService.saveWalletToDatabase(user.id, walletAddress, tokens);
      }
    };
    
    saveWalletIfLoggedIn();
  }, [isConnected, walletAddress, user?.id, tokens]);

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
  const connectWallet = useCallback(async () => {
    const address = await connectWalletStatus();
    if (address) {
      await fetchAndSetBalance(address);
      await fetchAndSetTokens(address);
    }
    return address;
  }, [connectWalletStatus, fetchAndSetBalance, fetchAndSetTokens]);

  // Disconnect wallet and clear data
  const disconnectWallet = useCallback(async () => {
    await disconnectWalletStatus();
    setSelectedToken(null);
  }, [disconnectWalletStatus, setSelectedToken]);

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
    refreshTransactions
  };
}

// Re-export types for compatibility
export type { Token, Transaction } from '@/types/wallet';
