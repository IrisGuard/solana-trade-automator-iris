
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';
import { checkPhantomWalletInstalled, handleWalletError } from '@/utils/walletUtils';
import { walletService } from '@/services/walletService';
import { solanaService } from '@/services/solanaService';

export function useWalletConnection() {
  const { user } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);

  // Φόρτωση του πορτοφολιού από τη βάση δεδομένων αν ο χρήστης είναι συνδεδεμένος
  useEffect(() => {
    const loadSavedWallet = async () => {
      const wallet = await walletService.loadSavedWallet(user?.id);
      if (wallet) {
        setWalletAddress(wallet.address);
        await fetchAndSetBalance(wallet.address);
        await fetchAndSetTokens(wallet.address);
        setIsConnected(true);
        toast.success('Το πορτοφόλι συνδέθηκε αυτόματα');
      }
    };
    
    loadSavedWallet();
  }, [user?.id]);

  // Φόρτωση των tokens από το Phantom wallet
  const fetchAndSetTokens = async (address: string) => {
    try {
      setIsLoadingTokens(true);
      
      const phantom = window.phantom?.solana;
      if (!phantom) {
        console.error('Phantom wallet not found');
        setIsLoadingTokens(false);
        return;
      }
      
      toast.loading('Φόρτωση tokens...');
      
      // Χρήση του solanaService για φόρτωση πραγματικών tokens
      const userTokens = await solanaService.getTokenAccounts(address);
      setTokens(userTokens);
      
      // Αποθήκευση στη βάση δεδομένων αν ο χρήστης είναι συνδεδεμένος
      if (user?.id) {
        await walletService.saveWalletToDatabase(user.id, address, userTokens);
      }
      
      toast.success('Τα tokens φορτώθηκαν επιτυχώς');
    } catch (err) {
      console.error('Error fetching tokens:', err);
      toast.error('Σφάλμα κατά τη φόρτωση των tokens');
      setTokens([]);
    } finally {
      setIsLoadingTokens(false);
      toast.dismiss();
    }
  };

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
            
            // Αποθήκευση του πορτοφολιού στη βάση δεδομένων αν ο χρήστης είναι συνδεδεμένος
            if (user?.id) {
              await walletService.saveWalletToDatabase(user.id, address, tokens);
            }
          }
        }
      } catch (err) {
        console.log('No trusted connection:', err);
        // Δεν είναι σφάλμα, απλώς σημαίνει ότι ο χρήστης δεν έχει συνδεθεί προηγουμένως
      }
    };

    checkWalletConnection();
  }, [user?.id]);

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

  // Βοηθητική συνάρτηση για φόρτωση και ρύθμιση υπολοίπου
  const fetchAndSetBalance = async (address: string) => {
    const fetchedBalance = await solanaService.getSolBalance(address);
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
        await fetchAndSetTokens(address);
        setIsConnected(true);
        
        // Αποθήκευση του πορτοφολιού στη βάση δεδομένων αν ο χρήστης είναι συνδεδεμένος
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
  };

  // Επιλογή ενός token για trading
  const selectTokenForTrading = (tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      setSelectedToken(token);
      toast.success(`Επιλέχθηκε το ${token.symbol} για trading`);
      return token;
    }
    return null;
  };

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
