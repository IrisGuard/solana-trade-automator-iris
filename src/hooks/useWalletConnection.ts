
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';
import { checkPhantomWalletInstalled, handleWalletError } from '@/utils/walletUtils';
import { solanaService } from '@/services/solanaService';

export function useWalletConnection() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);

  // Έλεγχος αν το πορτοφόλι είναι ήδη συνδεδεμένο κατά την εκκίνηση
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Έλεγχος αν το Phantom είναι εγκατεστημένο
        const phantom = window.phantom?.solana;
        
        if (phantom && phantom.isPhantom) {
          // Έλεγχος αν ο χρήστης είναι ήδη συνδεδεμένος
          const response = await phantom.connect({ onlyIfTrusted: true });
          
          if (response && response.publicKey) {
            const address = response.publicKey.toString();
            setWalletAddress(address);
            await fetchAndSetBalance(address);
            await fetchAndSetTokens(address);
            setIsConnected(true);
            console.log('Wallet auto-connected:', address);
          }
        }
      } catch (err) {
        console.log('No trusted connection:', err);
        // Δεν είναι σφάλμα, απλώς σημαίνει ότι ο χρήστης δεν έχει συνδεθεί προηγουμένως
      }
    };

    checkWalletConnection();
  }, []);

  // Φόρτωση τιμών tokens κατά τη σύνδεση
  useEffect(() => {
    if (isConnected && tokens.length > 0) {
      const fetchPrices = async () => {
        try {
          const prices: Record<string, number> = {};
          
          for (const token of tokens) {
            // Χρήση του solanaService για λήψη πραγματικών τιμών
            prices[token.address] = await solanaService.getTokenPrice(token.address);
          }
          
          setTokenPrices(prices);
        } catch (error) {
          console.error("Error fetching token prices:", error);
        }
      };
      
      fetchPrices();
      
      // Ανανέωση τιμών κάθε 60 δευτερόλεπτα
      const interval = setInterval(fetchPrices, 60000);
      return () => clearInterval(interval);
    }
  }, [isConnected, tokens]);

  // Φόρτωση των tokens από το Phantom wallet
  const fetchAndSetTokens = useCallback(async (address: string) => {
    try {
      setIsLoadingTokens(true);
      
      toast.loading('Φόρτωση tokens...');
      
      // Χρήση του solanaService για φόρτωση πραγματικών tokens
      const userTokens = await solanaService.getTokenAccounts(address);
      setTokens(userTokens);
      
      toast.success('Τα tokens φορτώθηκαν επιτυχώς');
    } catch (err) {
      console.error('Error fetching tokens:', err);
      toast.error('Σφάλμα κατά τη φόρτωση των tokens');
      setTokens([]);
    } finally {
      setIsLoadingTokens(false);
      toast.dismiss();
    }
  }, []);

  // Βοηθητική συνάρτηση για φόρτωση και ρύθμιση υπολοίπου
  const fetchAndSetBalance = useCallback(async (address: string) => {
    try {
      const fetchedBalance = await solanaService.getSolBalance(address);
      setBalance(fetchedBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
    }
  }, []);

  const connectWallet = useCallback(async () => {
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
        console.log('Connected to wallet:', address);
        setWalletAddress(address);
        await fetchAndSetBalance(address);
        await fetchAndSetTokens(address);
        setIsConnected(true);
        toast.success('Το πορτοφόλι συνδέθηκε επιτυχώς');
      }
    } catch (err) {
      console.error('Connection error:', err);
      const errorMsg = handleWalletError(err);
      setError(errorMsg);
    } finally {
      setIsConnecting(false);
      toast.dismiss();
    }
  }, [fetchAndSetBalance, fetchAndSetTokens]);

  const disconnectWallet = useCallback(async () => {
    try {
      const phantom = window.phantom?.solana;
      
      if (phantom && phantom.isPhantom) {
        toast.loading('Αποσύνδεση πορτοφολιού...');
        await phantom.disconnect();
        setIsConnected(false);
        setWalletAddress('');
        setBalance(null);
        setSelectedToken(null);
        setTokens([]);
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
  }, []);

  // Επιλογή ενός token για trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      setSelectedToken(token);
      toast.success(`Επιλέχθηκε το ${token.symbol} για trading`);
      return token;
    }
    return null;
  }, [tokens]);

  // Λήψη solBalance από την κατάσταση balance
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
    isLoadingTokens,
    error,
    isPhantomInstalled: checkPhantomWalletInstalled(),
    connectWallet,
    disconnectWallet,
    selectTokenForTrading,
  };
}

// Re-export types για συμβατότητα
export type { Token, Transaction } from '@/types/wallet';
