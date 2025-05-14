
import { useEffect, useRef } from 'react';

/**
 * Hook για την περιοδική ανανέωση των δεδομένων του wallet
 */
export function useDataRefresh(
  isConnected: boolean,
  walletAddress: string | null | undefined,
  refreshWalletData: (address: string, isConnected: boolean) => Promise<void>
) {
  // Track when we last refreshed to avoid too frequent refreshes
  const lastRefresh = useRef<number>(Date.now());
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Set a longer interval to reduce API calls - 2 minutes
  const REFRESH_INTERVAL = 2 * 60 * 1000;
  
  // Minimum time between manual refreshes - 30 seconds
  const MIN_REFRESH_INTERVAL = 30 * 1000;

  // Set up periodic data refresh
  useEffect(() => {
    const setupRefresh = () => {
      // Clear any existing interval
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
        refreshInterval.current = null;
      }
      
      // Only set up refresh if we're connected
      if (isConnected && walletAddress) {
        refreshInterval.current = setInterval(() => {
          const now = Date.now();
          // Only refresh if enough time has passed
          if (now - lastRefresh.current >= MIN_REFRESH_INTERVAL) {
            lastRefresh.current = now;
            console.log("Auto-refreshing wallet data");
            
            refreshWalletData(walletAddress, isConnected)
              .catch(err => console.error("Error during auto-refresh:", err));
          }
        }, REFRESH_INTERVAL);
      }
    };
    
    setupRefresh();
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [isConnected, walletAddress, refreshWalletData]);
}
