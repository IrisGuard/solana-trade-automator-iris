
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { isPhantomInstalled, connectPhantomWallet, disconnectPhantomWallet, registerPhantomEvents } from '@/utils/phantomWallet';
import { handleWalletError } from '@/utils/walletUtils';
import { Token } from '@/types/wallet';
import { fetchAllTokenBalances } from '@/services/solana/tokenService';
import { fetchSOLBalance } from '@/services/solana/walletService';
import { fetchTokenPrices } from '@/services/solana/priceService';
import { TokenPriceData } from '@/services/solana/priceService';
import { useErrorReporting } from '@/hooks/useErrorReporting';

export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { reportError } = useErrorReporting();

  // Check if wallet is installed and previously connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      console.log("Checking wallet connection on initialization...");
      try {
        // Check if Phantom is installed
        if (isPhantomInstalled()) {
          console.log("Phantom is installed, attempting trusted connection...");
          // Try to connect to a trusted wallet session
          try {
            const address = await connectPhantomWallet(true);
            if (address) {
              console.log("Trusted connection successful:", address);
              setWalletAddress(address);
              setIsConnected(true);
              loadWalletData(address);
            } else {
              console.log("No trusted wallet session found");
            }
          } catch (err) {
            // Αναμενόμενο για μη έμπιστα wallets, οπότε δεν το καταγράφουμε ως σφάλμα
            console.log("Auto-connect failed (expected for non-trusted wallets):", err);
          }
        } else {
          console.log("Phantom wallet is not installed");
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
        reportError(new Error(`Σφάλμα ελέγχου σύνδεσης wallet: ${err instanceof Error ? err.message : String(err)}`));
      }
    };

    // Εγγραφή για λήψη γεγονότων από το Phantom Wallet
    const cleanup = registerPhantomEvents(
      // Handler για σύνδεση
      (publicKey) => {
        console.log("Wallet connected from event:", publicKey);
        setWalletAddress(publicKey);
        setIsConnected(true);
        loadWalletData(publicKey);
        setIsConnecting(false);
      },
      // Handler για αποσύνδεση
      () => {
        console.log("Wallet disconnected from event");
        setWalletAddress('');
        setIsConnected(false);
        setSolBalance(0);
        setTokens([]);
        setIsConnecting(false);
      }
    );

    checkWalletConnection();
    
    return cleanup;
  }, []);

  // Load wallet data (balance, tokens, etc)
  const loadWalletData = useCallback(async (address: string) => {
    if (!address) return;
    
    console.log("Loading wallet data for address:", address);
    try {
      // Load SOL balance
      const balance = await fetchSOLBalance(address);
      setSolBalance(balance);
      console.log("SOL balance loaded:", balance);
      
      // Load tokens with loading indicator
      setIsLoadingTokens(true);
      const userTokens = await fetchAllTokenBalances(address);
      setTokens(userTokens);
      console.log(`Loaded ${userTokens.length} tokens`);
      
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
        console.log("Token prices loaded for", Object.keys(simplePrices).length, "tokens");
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading wallet data:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Σφάλμα φόρτωσης δεδομένων πορτοφολιού: ${errorMessage}`);
      toast.error('Αποτυχία φόρτωσης δεδομένων πορτοφολιού');
      reportError(new Error(`Σφάλμα φόρτωσης δεδομένων wallet: ${errorMessage}`));
    } finally {
      setIsLoadingTokens(false);
    }
  }, [reportError]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (isConnecting) {
      console.log("Connection already in progress, ignoring request");
      return false;
    }
    
    console.log("Initiating wallet connection...");
    try {
      setIsConnecting(true);
      setError(null);
      
      if (!isPhantomInstalled()) {
        console.log("Phantom wallet not installed");
        setError('Το Phantom wallet δεν είναι εγκατεστημένο');
        toast.error('Παρακαλώ εγκαταστήστε το Phantom wallet', {
          description: "Απαιτείται το Phantom Wallet για σύνδεση",
          duration: 5000
        });
        return false;
      }
      
      // Εμφάνιση toast για το αίτημα σύνδεσης
      toast.info("Αίτημα σύνδεσης στο Phantom Wallet...", {
        id: "phantom-connect-request",
        duration: 15000
      });
      
      console.log("Calling connectPhantomWallet...");
      const address = await connectPhantomWallet(false);
      
      if (address) {
        console.log("Connection successful:", address);
        setWalletAddress(address);
        setIsConnected(true);
        await loadWalletData(address);
        toast.success('Επιτυχής σύνδεση με το πορτοφόλι');
        toast.dismiss("phantom-connect-request");
        return true;
      } else {
        console.error("Connection returned null address");
        setError('Αποτυχία σύνδεσης πορτοφολιού');
        toast.error('Αποτυχία σύνδεσης με το πορτοφόλι');
        toast.dismiss("phantom-connect-request");
        return false;
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      const errorMessage = handleWalletError(err);
      setError(`Σφάλμα κατά τη σύνδεση πορτοφολιού: ${errorMessage}`);
      
      // Χρήση του errorReporting σε περίπτωση απροσδόκητων σφαλμάτων
      // αλλά όχι για περιπτώσεις που ο χρήστης απλά ακύρωσε τη σύνδεση
      if (!(err.code === 4001 || (err.message && err.message.includes('user rejected')))) {
        reportError(new Error(`Σφάλμα σύνδεσης wallet: ${errorMessage}`));
      }
      
      toast.error(`Σφάλμα σύνδεσης wallet: ${errorMessage}`);
      toast.dismiss("phantom-connect-request");
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, loadWalletData, reportError]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    console.log("Initiating wallet disconnection...");
    try {
      const success = await disconnectPhantomWallet();
      
      if (success) {
        console.log("Disconnection successful");
        setWalletAddress('');
        setIsConnected(false);
        setSolBalance(0);
        setTokens([]);
        setError(null);
        toast.success('Το πορτοφόλι αποσυνδέθηκε');
        return true;
      } else {
        console.error("Disconnection failed");
        setError('Αποτυχία αποσύνδεσης πορτοφολιού');
        toast.error('Αποτυχία αποσύνδεσης πορτοφολιού');
        return false;
      }
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Σφάλμα κατά την αποσύνδεση πορτοφολιού: ${errorMessage}`);
      toast.error('Σφάλμα κατά την αποσύνδεση του πορτοφολιού');
      reportError(new Error(`Σφάλμα αποσύνδεσης wallet: ${errorMessage}`));
      return false;
    }
  }, [reportError]);

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
    console.log("Refreshing wallet data...");
    await loadWalletData(walletAddress);
  }, [isConnected, walletAddress, loadWalletData]);

  // Refresh data every 30 seconds when connected
  useEffect(() => {
    if (!isConnected) return;
    
    console.log("Setting up wallet data refresh interval");
    const interval = setInterval(() => {
      console.log("Auto-refreshing wallet data");
      refreshWalletData();
    }, 30000);
    
    return () => {
      console.log("Clearing wallet data refresh interval");
      clearInterval(interval);
    };
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
