
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { isPhantomInstalled, connectPhantomWallet, disconnectPhantomWallet } from '@/utils/phantomWallet';
import { Token } from '@/types/wallet';
import { fetchAllTokenBalances } from '@/services/solana/tokenService';
import { fetchSOLBalance } from '@/services/solana/walletService';
import { fetchTokenPrices } from '@/services/solana/priceService';
import { TokenPriceData } from '@/services/solana/priceService';

export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is installed and previously connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check if Phantom is installed
        if (isPhantomInstalled()) {
          // Try to connect to a trusted wallet session
          const address = await connectPhantomWallet(true);
          if (address) {
            setWalletAddress(address);
            setIsConnected(true);
            loadWalletData(address);
          }
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };

    checkWalletConnection();
  }, []);

  // Load wallet data (balance, tokens, etc)
  const loadWalletData = useCallback(async (address: string) => {
    if (!address) return;
    
    try {
      // Load SOL balance
      const balance = await fetchSOLBalance(address);
      setSolBalance(balance);
      
      // Load tokens with loading indicator
      setIsLoadingTokens(true);
      const userTokens = await fetchAllTokenBalances(address);
      setTokens(userTokens);
      
      // Load token prices
      if (userTokens.length > 0) {
        const tokenAddresses = userTokens.map(token => token.address);
        const priceData = await fetchTokenPrices(tokenAddresses);
        
        // Convert the TokenPriceData to simple price record
        const simplePrices: Record<string, number> = {};
        
        // Safely extract price values
        Object.entries(priceData).forEach(([address, data]) => {
          if (data && typeof data === 'object' && 'price' in data) {
            simplePrices[address] = data.price;
          }
        });
        
        setTokenPrices(simplePrices);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading wallet data:', err);
      setError('Σφάλμα φόρτωσης δεδομένων πορτοφολιού');
      toast.error('Αποτυχία φόρτωσης δεδομένων πορτοφολιού');
    } finally {
      setIsLoadingTokens(false);
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      
      if (!isPhantomInstalled()) {
        setError('Το Phantom wallet δεν είναι εγκατεστημένο');
        toast.error('Παρακαλώ εγκαταστήστε το Phantom wallet');
        return false;
      }
      
      const address = await connectPhantomWallet();
      
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
        await loadWalletData(address);
        toast.success('Επιτυχής σύνδεση με το πορτοφόλι');
        return true;
      } else {
        setError('Αποτυχία σύνδεσης πορτοφολιού');
        toast.error('Αποτυχία σύνδεσης με το πορτοφόλι');
        return false;
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Σφάλμα κατά τη σύνδεση πορτοφολιού');
      toast.error('Σφάλμα κατά τη σύνδεση με το πορτοφόλι');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, loadWalletData]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      const success = await disconnectPhantomWallet();
      
      if (success) {
        setWalletAddress('');
        setIsConnected(false);
        setSolBalance(0);
        setTokens([]);
        setError(null);
        toast.success('Το πορτοφόλι αποσυνδέθηκε');
        return true;
      } else {
        setError('Αποτυχία αποσύνδεσης πορτοφολιού');
        toast.error('Αποτυχία αποσύνδεσης πορτοφολιού');
        return false;
      }
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Σφάλμα κατά την αποσύνδεση πορτοφολιού');
      toast.error('Σφάλμα κατά την αποσύνδεση του πορτοφολιού');
      return false;
    }
  }, []);

  // Select a token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      toast.success(`Επιλέχθηκε το ${token.symbol} για trading`);
      return token;
    }
    return null;
  }, [tokens]);

  // Refresh wallet data
  const refreshWalletData = useCallback(async () => {
    if (!isConnected || !walletAddress) return;
    await loadWalletData(walletAddress);
  }, [isConnected, walletAddress, loadWalletData]);

  // Refresh data every 30 seconds when connected
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      refreshWalletData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isConnected, refreshWalletData]);

  return {
    isConnected,
    walletAddress,
    solBalance,
    tokens,
    tokenPrices,
    isConnecting,
    isLoadingTokens,
    error,
    isPhantomInstalled: isPhantomInstalled(),
    connectWallet,
    disconnectWallet,
    selectTokenForTrading,
    refreshWalletData
  };
}
