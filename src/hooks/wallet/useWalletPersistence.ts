
import { useState, useEffect, useCallback } from 'react';
import { isPhantomInstalled } from '@/utils/phantomWallet';
import { getWalletFromLocalStorage } from '@/utils/wallet'; // Updated import path
import { useErrorReporting } from '@/hooks/useErrorReporting';

/**
 * Hook that handles wallet persistence and auto-reconnection
 */
export function useWalletPersistence(
  connectToWallet: (address: string) => Promise<void>,
  isConnected: boolean,
  isConnecting: boolean
) {
  const [isWalletInitialized, setIsWalletInitialized] = useState<boolean>(false);
  const { reportError } = useErrorReporting();
  
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
            // We don't clear the stored wallet here as that would be handled by the connectToWallet function
            setIsWalletInitialized(true);
          }
        } else {
          setIsWalletInitialized(true);
        }
      } catch (err) {
        console.error('Σφάλμα κατά την επανασύνδεση πορτοφολιού:', err);
        reportError(err);
        setIsWalletInitialized(true);
      }
    };
    
    if (!isConnected && !isConnecting && !isWalletInitialized) {
      attemptReconnect();
    }
  }, [phantomInstalled, isConnected, isConnecting, isWalletInitialized, connectToWallet, reportError]);

  return {
    isWalletInitialized
  };
}
