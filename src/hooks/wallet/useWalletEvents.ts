
import { useEffect, useCallback } from 'react';
import { registerPhantomEvents, isPhantomInstalled } from '@/utils/phantomWallet';

/**
 * Hook to manage wallet events
 */
export function useWalletEvents(
  onConnected: (address: string) => void, 
  onDisconnected: () => void
) {
  // Register for wallet events
  useEffect(() => {
    if (!isPhantomInstalled()) return;
    
    console.log("Registering for wallet events");
    
    // Setup event handlers
    const cleanup = registerPhantomEvents(
      // Handler for connection
      (publicKey) => {
        console.log("Wallet connected from event:", publicKey);
        onConnected(publicKey);
      },
      // Handler for disconnection  
      () => {
        console.log("Wallet disconnected from event");
        onDisconnected();
      }
    );
    
    return cleanup;
  }, [onConnected, onDisconnected]);
  
  // No additional state needed as all handlers are passed via parameters
  return {};
}
