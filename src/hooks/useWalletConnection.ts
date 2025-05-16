
import { useCallback } from 'react';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { useUser } from '@/hooks/useUser';
import { saveWalletToSupabase } from '@/utils/walletStorage';
import { useWalletConnectionCore } from './wallet/useWalletConnectionCore';
import { useWalletData } from './wallet/useWalletData';
import { useWalletPersistence } from './wallet/useWalletPersistence';
import { WalletConnectionHook } from './wallet/types';

export function useWalletConnection(): WalletConnectionHook {
  const {
    isConnected,
    isConnecting,
    error,
    walletAddress,
    isPhantomInstalled,
    connectWallet: coreConnectWallet,
    disconnectWallet,
    setWalletAddress,
    setIsConnected
  } = useWalletConnectionCore();

  const {
    tokens,
    tokenPrices,
    isLoadingTokens,
    solBalance,
    loadWalletData,
    selectTokenForTrading
  } = useWalletData();
  
  const { reportError } = useErrorReporting();
  const { user } = useUser();

  // Connect to a specific wallet address
  const connectToWallet = useCallback(async (address: string) => {
    console.log("Σύνδεση με το πορτοφόλι:", address);
    setWalletAddress(address);
    setIsConnected(true);
    
    // Fetch balances and tokens
    await refreshWalletData(address);
  }, [setWalletAddress, setIsConnected]);
  
  // Setup persistence hook (auto-reconnection)
  useWalletPersistence(connectToWallet, isConnected, isConnecting);
  
  // Enhanced connect wallet function that saves to Supabase and loads wallet data
  const connectWallet = useCallback(async () => {
    const address = await coreConnectWallet();
    
    if (address) {
      // Save to Supabase if user is logged in
      if (user?.id) {
        await saveWalletToSupabase(address, user.id);
      }
      
      // Load wallet data
      await refreshWalletData(address);
    }
    
    return address;
  }, [coreConnectWallet, user?.id, reportError]);
  
  // Refresh wallet data
  const refreshWalletData = useCallback(async (address?: string) => {
    const walletToUse = address || walletAddress;
    
    if (!walletToUse) {
      console.log("Δεν υπάρχει διεύθυνση πορτοφολιού για ανανέωση δεδομένων");
      return;
    }
    
    try {
      console.log('Ανανέωση δεδομένων πορτοφολιού για διεύθυνση:', walletToUse);
      await loadWalletData(walletToUse);
      console.log("Η ανανέωση δεδομένων πορτοφολιού ολοκληρώθηκε");
    } catch (err: any) {
      console.error('Σφάλμα ανανέωσης δεδομένων πορτοφολιού:', err);
      reportError(err);
    }
  }, [walletAddress, loadWalletData, reportError]);

  return {
    isConnected,
    isConnecting,
    error,
    walletAddress,
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    isPhantomInstalled,
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading
  };
}
