
import { useState, useCallback, useEffect } from 'react';
import { isPhantomInstalled } from '@/utils/phantomWallet';
import { useWalletAddress } from './wallet/useWalletAddress';
import { useWalletData } from './wallet/useWalletData';
import { useWalletEvents } from './wallet/useWalletEvents';
import { useWalletInit } from './wallet/useWalletInit';
import { useDataRefresh } from './wallet/useDataRefresh';

/**
 * Main wallet connection hook that combines all wallet functionality
 */
export function useWalletConnection() {
  // Get wallet address and connection status
  const {
    isConnected,
    walletAddress,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    setWalletAddress,
    setIsConnected,
  } = useWalletAddress();

  // Get wallet data (balance and tokens)
  const {
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    loadWalletData,
    refreshWalletData,
    selectTokenForTrading
  } = useWalletData();

  // Handle wallet connection events
  useWalletEvents(
    // On connected handler
    (publicKey) => {
      setWalletAddress(publicKey);
      setIsConnected(true);
      loadWalletData(publicKey);
    },
    // On disconnected handler
    () => {
      setWalletAddress('');
      setIsConnected(false);
    }
  );

  // Initialize wallet on component mount
  useWalletInit(
    setWalletAddress,
    setIsConnected,
    (address) => loadWalletData(address)
  );

  // Setup periodic data refresh
  useDataRefresh(
    isConnected,
    walletAddress,
    refreshWalletData
  );

  return {
    // Wallet state
    isConnected,
    walletAddress,
    isConnecting,
    error,
    
    // Wallet data
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    
    // Actions
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading,
    
    // Utility properties
    isPhantomInstalled: isPhantomInstalled(),
  };
}
