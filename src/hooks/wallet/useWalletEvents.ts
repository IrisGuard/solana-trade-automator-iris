
import { useEffect } from 'react';
import { registerPhantomEvents } from '@/utils/phantomWallet';

export function useWalletEvents() {
  useEffect(() => {
    // Register phantom wallet events without parameters
    const cleanup = registerPhantomEvents();
    
    return cleanup;
  }, []);
}
