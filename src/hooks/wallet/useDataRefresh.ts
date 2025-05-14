
import { useEffect, useRef } from 'react';

/**
 * Hook to periodically refresh wallet data when connected
 */
export function useDataRefresh(
  isConnected: boolean, 
  walletAddress: string, 
  refreshFunction: () => Promise<void>
) {
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const refreshData = async () => {
      if (isConnected && walletAddress) {
        try {
          await refreshFunction();
        } catch (error) {
          console.error("Error refreshing wallet data:", error);
        }
      }
    };

    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // Set up a new interval if connected
    if (isConnected && walletAddress) {
      // Refresh once immediately
      refreshData();
      
      // Then set up the interval
      refreshIntervalRef.current = setInterval(refreshData, 30000); // refresh every 30 seconds
    }

    // Cleanup on unmount or when connection state changes
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isConnected, walletAddress, refreshFunction]);
}
