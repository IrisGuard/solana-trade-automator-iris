
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function useWalletStatus() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connected) return;

    setIsLoading(true);
    try {
      // Simple balance fetch - will be replaced with proper Solana service
      console.log('Fetching balance for:', publicKey.toString());
      setBalance(0); // Placeholder
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connected]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    } else {
      setBalance(0);
    }
  }, [connected, publicKey, fetchBalance]);

  return {
    connected,
    publicKey,
    balance,
    isLoading,
    refreshBalance: fetchBalance,
    walletAddress: publicKey?.toString() || null,
    setBalance
  };
}
