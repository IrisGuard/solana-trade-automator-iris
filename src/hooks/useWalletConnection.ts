
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
  const [isWalletInitialized, setIsWalletInitialized] = useState<boolean>(false);
  
  const { reportError } = useErrorReporting();
  const { user } = useUser();
  const { tokens, tokenPrices, isLoadingTokens, loadWalletData, selectTokenForTrading } = useWalletData();
  
  // Check if phantom is installed
  const phantomInstalled = isPhantomInstalled();
  
  // Try to reconnect on component mount
  useEffect(() => {
    const attemptReconnect = async () => {
      if (isWalletInitialized) return;
      
      // Check for stored wallet
      try {
        const storedWallet = getWalletFromLocalStorage();
        
        if (storedWallet && phantomInstalled) {
          try {
            console.log('Απόπειρα επανασύνδεσης πορτοφολιού:', storedWallet.address);
            setIsWalletInitialized(true);
            await connectToWallet(storedWallet.address);
          } catch (err) {
            console.error('Η αυτόματη επανασύνδεση απέτυχε:', err);
            // Clear stored wallet if reconnection fails
            removeWalletFromStorage(storedWallet.address, user?.id);
          }
        } else {
          setIsWalletInitialized(true);
        }
      } catch (err) {
        console.error('Σφάλμα κατά την επανασύνδεση πορτοφολιού:', err);
        setIsWalletInitialized(true);
      }
    };
    
    if (!isConnected && !isConnecting && !isWalletInitialized) {
      attemptReconnect();
    }
  }, [phantomInstalled, user, isConnected, isConnecting, isWalletInitialized]);
  
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
      console.log("Προσπάθεια σύνδεσης με Phantom wallet...");
      // @ts-ignore - Phantom global object
      const { solana } = window;
      
      if (!solana || !solana.isPhantom) {
        throw new Error("Δεν εντοπίστηκε το Phantom wallet");
      }
      
      const response = await solana.connect();
      const address = response.publicKey.toString();
      
      console.log('Συνδέθηκε σε πορτοφόλι:', address);
      
      await connectToWallet(address);
      
      // Save wallet to storage
      saveWalletToLocalStorage(address);
      if (user?.id) {
        await saveWalletToSupabase(address, user.id);
      }
      
      toast.success("Το wallet συνδέθηκε επιτυχώς!");
    } catch (err: any) {
      console.error('Σφάλμα σύνδεσης wallet:', err);
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
    console.log("Σύνδεση με το πορτοφόλι:", address);
    setWalletAddress(address);
    setIsConnected(true);
    
    // Fetch balances and tokens
    await refreshWalletData(address);
  }, []);
  
  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      console.log("Αποσύνδεση πορτοφολιού...");
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
      console.error('Σφάλμα αποσύνδεσης wallet:', err);
      reportError(err);
    }
  }, [walletAddress, user?.id, reportError]);
  
  // Refresh wallet data
  const refreshWalletData = useCallback(async (address?: string) => {
    const walletToUse = address || walletAddress;
    
    if (!walletToUse) {
      console.log("Δεν υπάρχει διεύθυνση πορτοφολιού για ανανέωση δεδομένων");
      return;
    }
    
    try {
      console.log('Ανανέωση δεδομένων πορτοφολιού για διεύθυνση:', walletToUse);
      
      // Get SOL balance using solanaService instead of mock data
      try {
        console.log("Λήψη υπολοίπου SOL...");
        const balance = await solanaService.fetchSOLBalance(walletToUse);
        console.log('Ελήφθη υπόλοιπο SOL:', balance);
        setSolBalance(balance);
      } catch (balanceError) {
        console.error('Σφάλμα λήψης υπολοίπου SOL:', balanceError);
        reportError(balanceError);
      }
      
      // Load token data
      console.log("Λήψη δεδομένων token...");
      await loadWalletData(walletToUse);
      console.log("Η ανανέωση δεδομένων πορτοφολιού ολοκληρώθηκε");
    } catch (err: any) {
      console.error('Σφάλμα ανανέωσης δεδομένων πορτοφολιού:', err);
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
