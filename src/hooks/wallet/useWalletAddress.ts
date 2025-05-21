
import { useState, useEffect } from '../../react-compatibility';

export function useWalletAddress() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Check local storage for saved wallet on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
    }
  }, []);
  
  return { walletAddress, isConnected, setWalletAddress, setIsConnected };
}
