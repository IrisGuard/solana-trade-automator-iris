import { PublicKey } from '@solana/web3.js';
import { useSolana } from '@providers/SolanaWalletProvider';
import { useEffect, useState } from 'react';
import { logError } from '@/utils/errorUtils';

interface WalletService {
  publicKey: PublicKey | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const useWalletService = (): WalletService => {
  const { publicKey, connect, disconnect } = useSolana();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(!!publicKey);
  }, [publicKey]);

  const handleConnect = async () => {
    try {
      await connect();
      setIsConnected(true);
    } catch (error: any) {
      logError(error, 'useWalletService', 'Error connecting wallet');
      setIsConnected(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsConnected(false);
    } catch (error: any) {
      logError(error, 'useWalletService', 'Error disconnecting wallet');
    }
  };

  return {
    publicKey,
    isConnected,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
};
