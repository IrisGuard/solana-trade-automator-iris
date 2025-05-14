
import { useEffect, useCallback } from 'react';

/**
 * Hook to handle periodic data refresh
 */
export function useDataRefresh(
  isConnected: boolean,
  walletAddress: string,
  refreshCallback: (address: string, isConnected: boolean) => Promise<void>,
  intervalMs: number = 30000
) {
  // Refresh data periodically when connected
  useEffect(() => {
    if (!isConnected) return;
    
    console.log("Setting up wallet data refresh interval");
    const interval = setInterval(() => {
      console.log("Auto-refreshing wallet data");
      refreshCallback(walletAddress, isConnected);
    }, intervalMs);
    
    return () => {
      console.log("Clearing wallet data refresh interval");
      clearInterval(interval);
    };
  }, [isConnected, walletAddress, refreshCallback, intervalMs]);

  return {};
}
