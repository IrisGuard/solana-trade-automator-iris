
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { isPhantomInstalled } from '@/utils/phantomWallet';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { useUser } from '@/hooks/useUser';
import { 
  saveWalletToLocalStorage, 
  saveWalletToSupabase, 
  removeWalletFromStorage, 
  getWalletFromLocalStorage 
} from '@/utils/walletStorage';
import { solanaService } from '@/services/solana';
import { useWalletData } from './wallet/useWalletData';
import { WalletConnectionHook } from './wallet/types';

export function useWalletConnection(): WalletConnectionHook {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number>(0);
  
  const { reportError } = useErrorReporting();
  const { user } = useUser();
  const { tokens, tokenPrices, isLoadingTokens, loadWalletData, selectTokenForTrading } = useWalletData();
  
  // Check if phantom is installed
  const phantomInstalled = isPhantomInstalled();
  
  // Try to reconnect on component mount
  useEffect(() => {
    const attemptReconnect = async () => {
      // Check for stored wallet
      const storedWallet = getWalletFromLocalStorage();
      
      if (storedWallet && phantomInstalled) {
        try {
          console.log('Attempting to reconnect wallet:', storedWallet.address);
          await connectToWallet(storedWallet.address);
        } catch (err) {
          console.error('Auto-reconnect failed:', err);
          // Clear stored wallet if reconnection fails
          removeWalletFromStorage(storedWallet.address, user?.id);
        }
      }
    };
    
    if (!isConnected && !isConnecting) {
      attemptReconnect();
    }
  }, [phantomInstalled, user]);
  
  // Connect to wallet
  const connectWallet = useCallback(async () => {
    if (!phantomInstalled) {
      toast.error("Το Phantom wallet δεν είναι εγκατεστημένο.", {
        description: "Εγκαταστήστε το Phantom wallet για να συνδεθείτε.",
        action: {
          label: "Εγκατάσταση",
          onClick: () => window.open("https://phantom.app/", "_blank")
        }
      });
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // @ts-ignore - Phantom global object
      const { solana } = window;
      
      if (!solana || !solana.isPhantom) {
        throw new Error("Phantom wallet not detected");
      }
      
      const response = await solana.connect();
      const address = response.publicKey.toString();
      
      console.log('Connected to wallet:', address);
      
      await connectToWallet(address);
      
      // Save wallet to storage
      saveWalletToLocalStorage(address);
      if (user?.id) {
        await saveWalletToSupabase(address, user.id);
      }
      
      toast.success("Το wallet συνδέθηκε επιτυχώς!");
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Σφάλμα σύνδεσης wallet');
      reportError(err);
      toast.error("Σφάλμα σύνδεσης με το wallet", {
        description: err.message
      });
    } finally {
      setIsConnecting(false);
    }
  }, [phantomInstalled, user?.id, reportError]);
  
  // Connect to a specific wallet address
  const connectToWallet = useCallback(async (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    
    // Fetch balances and tokens
    await refreshWalletData(address);
  }, []);
  
  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      // @ts-ignore - Phantom global object
      const { solana } = window;
      
      if (solana && solana.disconnect) {
        await solana.disconnect();
      }
      
      // Remove from storage
      if (walletAddress) {
        await removeWalletFromStorage(walletAddress, user?.id);
      }
      
      // Reset state
      setIsConnected(false);
      setWalletAddress(null);
      setSolBalance(0);
      
      toast.info("Το wallet αποσυνδέθηκε");
    } catch (err: any) {
      console.error('Wallet disconnection error:', err);
      reportError(err);
    }
  }, [walletAddress, user?.id, reportError]);
  
  // Refresh wallet data
  const refreshWalletData = useCallback(async (address?: string) => {
    const walletToUse = address || walletAddress;
    
    if (!walletToUse) {
      return;
    }
    
    try {
      console.log('Refreshing wallet data for address:', walletToUse);
      
      // Get SOL balance using solanaService instead of mock data
      try {
        const balance = await solanaService.fetchSOLBalance(walletToUse);
        console.log('Fetched SOL balance:', balance);
        setSolBalance(balance);
      } catch (balanceError) {
        console.error('Error fetching SOL balance:', balanceError);
        reportError(balanceError);
      }
      
      // Load token data
      await loadWalletData(walletToUse);
    } catch (err: any) {
      console.error('Error refreshing wallet data:', err);
      reportError(err);
    }
  }, [walletAddress, reportError, loadWalletData]);
  
  return {
    isConnected,
    isConnecting,
    error,
    walletAddress,
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    isPhantomInstalled: phantomInstalled,
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading
  };
}
