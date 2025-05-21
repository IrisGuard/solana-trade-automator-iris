
import { useState, useEffect } from '../react-compatibility';
import { useWalletBalance } from './useWalletBalance';
import { useWalletAddress } from './useWalletAddress';
import { toast } from 'sonner';
import { fetchWalletData } from '@/services/wallet';
import { Token } from '@/types/wallet';

export function useWalletData() {
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  
  const { walletAddress, isConnected } = useWalletAddress();
  const { solBalance, loadSolBalance } = useWalletBalance();

  useEffect(() => {
    const loadData = async () => {
      if (!isConnected || !walletAddress) return;
      
      setLoading(true);
      
      try {
        // Load SOL balance
        await loadSolBalance(walletAddress);
        
        // Load token data
        const tokenData = await fetchWalletData(walletAddress);
        if (tokenData) {
          setTokens(tokenData.tokens || []);
        }
      } catch (error) {
        console.error('Error loading wallet data:', error);
        toast.error('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [walletAddress, isConnected, loadSolBalance]);
  
  return {
    walletAddress,
    isConnected,
    solBalance,
    tokens,
    loading
  };
}
