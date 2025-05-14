
import { useEffect } from 'react';
import { registerPhantomEvents } from '@/utils/phantomWallet';

/**
 * Hook για τη διαχείριση των γεγονότων του wallet
 */
export function useWalletEvents(
  onConnected?: (publicKey: string) => void,
  onDisconnected?: () => void
) {
  useEffect(() => {
    // Εγγραφή στα γεγονότα του Phantom Wallet
    const cleanup = registerPhantomEvents(
      // Όταν συνδεθεί το πορτοφόλι
      (publicKey) => {
        console.log("Wallet connected event received:", publicKey);
        if (onConnected) onConnected(publicKey);
      },
      // Όταν αποσυνδεθεί το πορτοφόλι
      () => {
        console.log("Wallet disconnected event received");
        if (onDisconnected) onDisconnected();
      }
    );
    
    // Cleanup function για την αποεγγραφή από τα events
    return cleanup;
  }, [onConnected, onDisconnected]);

  return {};
}
