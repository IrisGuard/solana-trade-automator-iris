
import { useState, useCallback } from '../../react-runtime';
import { isPhantomInstalled, connectPhantomWallet, disconnectPhantomWallet } from '@/utils/phantomWallet';
import { toast } from 'sonner';

export function useWalletAddress() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (!isPhantomInstalled()) {
      const errorMsg = 'Phantom wallet not installed';
      setError(errorMsg);
      toast.error(errorMsg, {
        description: 'Please install Phantom to connect',
      });
      return null;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      const address = await connectPhantomWallet();
      
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
        return address;
      }
      
      return null;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect wallet';
      console.error('Wallet connection error:', err);
      setError(errorMsg);
      toast.error('Connection failed', {
        description: errorMsg
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet function
  const disconnectWallet = async (): Promise<void> => {
    setWalletAddress('');
    localStorage.removeItem('wallet');
    return Promise.resolve();
  };

  return {
    walletAddress,
    isConnected,
    isConnecting,
    error,
    setWalletAddress,
    setIsConnected,
    connectWallet,
    disconnectWallet
  };
}
