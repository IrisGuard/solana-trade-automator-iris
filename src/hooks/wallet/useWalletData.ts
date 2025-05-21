
import { useState, useEffect } from '../../react-compatibility';
import { useWalletBalance } from './useWalletBalance';
import { useWalletAddress } from './useWalletAddress';
import { toast } from 'sonner';
import { fetchWalletData } from '@/services/wallet';
import { Token } from '@/types/wallet';

export function useWalletData() {
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [tokenPrices, setTokenPrices] = useState({});
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  
  const { walletAddress, isConnected } = useWalletAddress();
  const { solBalance, loadSolBalance } = useWalletBalance();

  // Add the missing function
  const loadWalletData = async (address: string) => {
    setIsLoadingTokens(true);
    try {
      const data = await fetchWalletData(address);
      if (data && data.tokens) {
        setTokens(data.tokens);
      }
    } catch (error) {
      console.error("Error loading wallet data:", error);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  // Add the missing function
  const selectTokenForTrading = async (tokenAddress: string) => {
    console.log(`Selected token for trading: ${tokenAddress}`);
    return true;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!isConnected || !walletAddress) return;
      
      setLoading(true);
      
      try {
        // Load SOL balance
        await loadSolBalance(walletAddress);
        
        // Load token data
        await loadWalletData(walletAddress);
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
    loading,
    tokenPrices,
    isLoadingTokens,
    loadWalletData,
    selectTokenForTrading
  };
}
