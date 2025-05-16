
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { isPhantomInstalled } from '@/utils/phantomWallet';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { 
  saveWalletToLocalStorage, 
  removeWalletFromStorage 
} from '@/utils/wallet'; // Updated import path
import { useUser } from '@/hooks/useUser';

/**
 * Core hook for connecting/disconnecting with a wallet
 */
export function useWalletConnectionCore() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  const { reportError } = useErrorReporting();
  const { user } = useUser();
  
  // Check if phantom is installed
  const phantomInstalled = isPhantomInstalled();
  
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
      
      setWalletAddress(address);
      setIsConnected(true);
      
      // Save wallet to storage
      saveWalletToLocalStorage(address);
      
      toast.success("Το wallet συνδέθηκε επιτυχώς!");
      return address;
    } catch (err: any) {
      console.error('Σφάλμα σύνδεσης wallet:', err);
      setError(err.message || 'Σφάλμα σύνδεσης wallet');
      reportError(err);
      toast.error("Σφάλμα σύνδεσης με το wallet", {
        description: err.message
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [phantomInstalled, reportError]);
  
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
      
      toast.info("Το wallet αποσυνδέθηκε");
    } catch (err: any) {
      console.error('Σφάλμα αποσύνδεσης wallet:', err);
      reportError(err);
    }
  }, [walletAddress, user?.id, reportError]);

  return {
    isConnected,
    isConnecting,
    error,
    walletAddress,
    isPhantomInstalled: phantomInstalled,
    connectWallet,
    disconnectWallet,
    setWalletAddress,
    setIsConnected
  };
}
