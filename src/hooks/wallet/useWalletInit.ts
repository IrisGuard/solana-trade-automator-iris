
import { useEffect, useCallback } from 'react';
import { isPhantomInstalled, connectPhantomWallet } from '@/utils/phantomWallet';
import { useErrorReporting } from '@/hooks/useErrorReporting';

/**
 * Hook to handle wallet initialization logic
 */
export function useWalletInit(
  setWalletAddress: (address: string) => void,
  setIsConnected: (isConnected: boolean) => void,
  onWalletConnected: (address: string) => Promise<void>
) {
  const { reportError } = useErrorReporting();

  // Check wallet connection on init
  useEffect(() => {
    const checkWalletConnection = async () => {
      console.log("Checking wallet connection on initialization...");
      try {
        // Check if Phantom is installed
        if (isPhantomInstalled()) {
          console.log("Phantom is installed, attempting trusted connection...");
          // Try to connect to a trusted wallet session
          try {
            const address = await connectPhantomWallet(true);
            if (address) {
              console.log("Trusted connection successful:", address);
              setWalletAddress(address);
              setIsConnected(true);
              await onWalletConnected(address);
            } else {
              console.log("No trusted wallet session found");
            }
          } catch (err) {
            // Αναμενόμενο για μη έμπιστα wallets, οπότε δεν το καταγράφουμε ως σφάλμα
            console.log("Auto-connect failed (expected for non-trusted wallets):", err);
          }
        } else {
          console.log("Phantom wallet is not installed");
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
        reportError(new Error(`Σφάλμα ελέγχου σύνδεσης wallet: ${err instanceof Error ? err.message : String(err)}`));
      }
    };

    checkWalletConnection();
  }, [setWalletAddress, setIsConnected, onWalletConnected, reportError]);

  return {};
}
