
import { useEffect } from '../react-compatibility';

/**
 * Hook to periodically refresh wallet data
 * @param isConnected Whether wallet is connected
 * @param walletAddress Wallet address
 * @param refreshFunction Function to refresh wallet data
 */
export function useDataRefresh(
  isConnected: boolean,
  walletAddress: string,
  refreshFunction: () => Promise<void> | void
) {
  useEffect(() => {
    // Only set up refresh if wallet is connected
    if (!isConnected || !walletAddress) {
      return;
    }
    
    console.log("Setting up periodic data refresh for wallet:", walletAddress);
    
    // Refresh every 60 seconds
    const interval = setInterval(async () => {
      console.log("Auto-refreshing wallet data...");
      try {
        const result = refreshFunction();
        // Handle both Promise and void return types
        if (result instanceof Promise) {
          await result;
        }
      } catch (err) {
        console.error("Error during auto-refresh:", err);
      }
    }, 60000);
    
    // Clean up interval on unmount or wallet change
    return () => {
      console.log("Cleaning up data refresh interval");
      clearInterval(interval);
    };
  }, [isConnected, walletAddress, refreshFunction]);

  return {};
}
