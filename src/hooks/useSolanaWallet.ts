
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Token } from '@/types/wallet';
import { tokenService } from '@/services/solana/tokenService';

export function useSolanaWallet() {
  const { connection } = useConnection();
  const { 
    publicKey, 
    connected, 
    connecting,
    disconnect,
    connect,
    wallet,
    disconnecting,
    select
  } = useWallet();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Φόρτωση υπολοίπου
  const fetchBalance = useCallback(async () => {
    if (!publicKey) return null;

    try {
      setIsLoadingBalance(true);
      setConnectionError(null);
      const balanceInLamports = await connection.getBalance(publicKey);
      const solBalance = balanceInLamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
      return solBalance;
    } catch (error) {
      console.error("Σφάλμα κατά τη φόρτωση του υπολοίπου:", error);
      const errorMessage = "Δεν ήταν δυνατή η φόρτωση του υπολοίπου";
      toast.error(errorMessage);
      setConnectionError(errorMessage);
      return null;
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, connection]);

  // Φόρτωση tokens
  const fetchTokens = useCallback(async () => {
    if (!publicKey) return [];
    
    try {
      setIsLoadingTokens(true);
      setConnectionError(null);
      toast.loading('Φόρτωση tokens...');
      
      // Χρήση του tokenService για τη φόρτωση των tokens
      const userTokens = await tokenService.getTokenAccounts(publicKey.toString());
      
      setTokens(userTokens);
      toast.success('Τα tokens φορτώθηκαν επιτυχώς');
      return userTokens;
    } catch (err) {
      console.error('Σφάλμα φόρτωσης tokens:', err);
      const errorMessage = 'Σφάλμα κατά τη φόρτωση των tokens';
      toast.error(errorMessage);
      setConnectionError(errorMessage);
      setTokens([]);
      return [];
    } finally {
      setIsLoadingTokens(false);
      toast.dismiss();
    }
  }, [publicKey]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      if (wallet) {
        setConnectionError(null);
        toast.loading('Σύνδεση με το πορτοφόλι...');
        await connect();
        return true;
      } else {
        const errorMessage = 'Επιλέξτε ένα πορτοφόλι πρώτα';
        toast.error(errorMessage);
        setConnectionError(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Σφάλμα σύνδεσης πορτοφολιού:', error);
      const errorMessage = 'Δεν ήταν δυνατή η σύνδεση με το πορτοφόλι';
      toast.error(errorMessage);
      setConnectionError(errorMessage);
      return false;
    } finally {
      toast.dismiss();
    }
  }, [wallet, connect]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      toast.loading('Αποσύνδεση πορτοφολιού...');
      await disconnect();
      toast.success('Το πορτοφόλι αποσυνδέθηκε');
      setBalance(null);
      setTokens([]);
      setConnectionError(null);
      return true;
    } catch (error) {
      console.error('Σφάλμα αποσύνδεσης πορτοφολιού:', error);
      const errorMessage = 'Δεν ήταν δυνατή η αποσύνδεση του πορτοφολιού';
      toast.error(errorMessage);
      setConnectionError(errorMessage);
      return false;
    } finally {
      toast.dismiss();
    }
  }, [disconnect]);

  // Φόρτωση υπολοίπου όταν συνδέεται το πορτοφόλι
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      fetchTokens();
    }
  }, [connected, publicKey, fetchBalance, fetchTokens]);

  // Επανάληψη της φόρτωσης κάθε 30 δευτερόλεπτα όταν είναι συνδεδεμένο
  useEffect(() => {
    if (!connected || !publicKey) return;
    
    const interval = setInterval(() => {
      fetchBalance();
      fetchTokens();
    }, 30000); // Κάθε 30 δευτερόλεπτα
    
    return () => clearInterval(interval);
  }, [connected, publicKey, fetchBalance, fetchTokens]);

  return {
    publicKey,
    walletAddress: publicKey?.toString() || '',
    connected,
    connecting,
    disconnecting,
    balance,
    isLoadingBalance,
    tokens,
    isLoadingTokens,
    connectionError,
    selectWallet: select,
    connectWallet,
    disconnectWallet,
    fetchBalance,
    fetchTokens
  };
}
