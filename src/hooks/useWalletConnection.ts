
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';
import { checkPhantomWalletInstalled, fetchSolanaBalance, handleWalletError, fetchTokenPrice } from '@/utils/walletUtils';
import { walletService } from '@/services/walletService';
import { getMockTokens } from '@/data/mockWalletData';

export function useWalletConnection() {
  const { user } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>(getMockTokens());
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});

  // Load wallet from database if user is logged in
  useEffect(() => {
    const loadSavedWallet = async () => {
      const wallet = await walletService.loadSavedWallet(user?.id);
      if (wallet) {
        setWalletAddress(wallet.address);
        await fetchAndSetBalance(wallet.address);
        setIsConnected(true);
        toast.success('Το πορτοφόλι συνδέθηκε αυτόματα');
      }
    };
    
    loadSavedWallet();
  }, [user?.id]);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Check if Phantom is installed
        const phantom = window.phantom?.solana;
        
        if (phantom && phantom.isPhantom) {
          // Check if user is already connected
          const response = await phantom.connect({ onlyIfTrusted: true });
          
          if (response && response.publicKey) {
            const address = response.publicKey.toString();
            setWalletAddress(address);
            await fetchAndSetBalance(address);
            setIsConnected(true);
            
            // Save wallet to database if user is logged in
            if (user?.id) {
              await walletService.saveWalletToDatabase(user.id, address, tokens);
            }
          }
        }
      } catch (err) {
        console.log('No trusted connection:', err);
        // This is not an error, just means the user hasn't connected before
      }
    };

    checkWalletConnection();
  }, [user?.id]);

  // Fetch token prices on connection
  useEffect(() => {
    if (isConnected && tokens.length > 0) {
      const fetchPrices = async () => {
        try {
          const prices: Record<string, number> = {};
          
          for (const token of tokens) {
            // In a real app, you'd fetch prices from an API
            prices[token.address] = await fetchTokenPrice(token.address);
          }
          
          setTokenPrices(prices);
        } catch (error) {
          console.error("Error fetching token prices:", error);
        }
      };
      
      fetchPrices();
      
      // Refresh prices every 60 seconds
      const interval = setInterval(fetchPrices, 60000);
      return () => clearInterval(interval);
    }
  }, [isConnected, tokens]);

  // Helper function to fetch and set balance
  const fetchAndSetBalance = async (address: string) => {
    const fetchedBalance = await fetchSolanaBalance(address);
    setBalance(fetchedBalance);
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const phantom = window.phantom?.solana;

      if (!phantom) {
        const errorMsg = 'Το Phantom wallet δεν βρέθηκε! Παρακαλώ εγκαταστήστε το.';
        setError(errorMsg);
        toast.error(errorMsg);
        setIsConnecting(false);
        return;
      }

      toast.loading('Σύνδεση με το Phantom wallet...');
      
      const response = await phantom.connect();
      
      if (response && response.publicKey) {
        const address = response.publicKey.toString();
        setWalletAddress(address);
        await fetchAndSetBalance(address);
        setIsConnected(true);
        
        // Save wallet to database if user is logged in
        if (user?.id) {
          await walletService.saveWalletToDatabase(user.id, address, tokens);
          toast.success('Το πορτοφόλι συνδέθηκε και αποθηκεύτηκε');
        } else {
          toast.success('Το πορτοφόλι συνδέθηκε επιτυχώς');
        }
      }
    } catch (err) {
      const errorMsg = handleWalletError(err);
      setError(errorMsg);
    } finally {
      setIsConnecting(false);
      toast.dismiss();
    }
  };

  const disconnectWallet = async () => {
    try {
      const phantom = window.phantom?.solana;
      
      if (phantom && phantom.isPhantom) {
        toast.loading('Αποσύνδεση πορτοφολιού...');
        await phantom.disconnect();
        setIsConnected(false);
        setWalletAddress('');
        setBalance(null);
        setSelectedToken(null);
        toast.success('Το πορτοφόλι αποσυνδέθηκε');
      }
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      const errorMsg = 'Αποτυχία αποσύνδεσης πορτοφολιού';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      toast.dismiss();
    }
  };

  // Select a token for trading
  const selectTokenForTrading = (tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      setSelectedToken(token);
      toast.success(`Επιλέχθηκε το ${token.symbol} για trading`);
      return token;
    }
    return null;
  };

  // Get solBalance from the balance state
  const solBalance = balance || 0;

  return {
    walletAddress,
    balance,
    solBalance,
    tokens,
    tokenPrices,
    selectedToken,
    isConnected,
    isConnecting,
    error,
    isPhantomInstalled: checkPhantomWalletInstalled(),
    connectWallet,
    disconnectWallet,
    selectTokenForTrading,
  };
}

// Re-export types for backward compatibility
export type { Token, Transaction } from '@/types/wallet';
