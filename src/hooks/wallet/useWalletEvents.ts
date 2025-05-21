
import { useEffect } from '../../react-runtime';
import { registerPhantomEvents } from '@/utils/phantomWallet';

/**
 * Hook to handle wallet connection events
 * @param onConnected Called when wallet is connected
 * @param onDisconnected Called when wallet is disconnected
 */
export function useWalletEvents(
  onConnected: (publicKey: string) => void,
  onDisconnected: () => Promise<void>
) {
  useEffect(() => {
    // Register wallet connection events
    const cleanup = registerPhantomEvents(
      // Connected handler
      (publicKey) => {
        console.log("Wallet connected event:", publicKey);
        onConnected(publicKey);
      },
      // Disconnected handler
      () => {
        console.log("Wallet disconnected event");
        return onDisconnected();
      }
    );
    
    // Return cleanup function
    return cleanup;
  }, [onConnected, onDisconnected]);

  return {};
}
