
import { useWalletConnection } from './useWalletConnection';

/**
 * Legacy hook for backwards compatibility
 * Wraps the useWalletConnection hook
 */
export function usePhantomConnection() {
  return useWalletConnection();
}
