import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Token } from '@/types/wallet';
import { tokenService } from '@/services/solana/token';

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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Φόρτωση υπολοίπου
  const fetchBalance = useCallback(async () => {
    if (!publicKey) return null;

    try {
      setIsLoadingBalance(true);
      setConnectionError(null);
      const balanceInLamports = await connection.getBalance(publicKey);
      const solBalance = balanceInLamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
      setRetryCount(0); // Επιτυχία, μηδενίζουμε τις επαναπροσπάθειες
      return solBalance;
    } catch (error) {
      console.error("Σφάλμα κατά τη φόρτωση του υπολοίπου:", error);
      // Αν είναι η πρώτη αποτυχία, δοκιμάζουμε ξανά μετά από λίγο
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        const errorMessage = "Πρόβλημα σύνδεσης με το δίκτυο Solana. Δοκιμάζουμε ξανά...";
        setConnectionError(errorMessage);
        // Δοκιμάζουμε ξανά μετά από 2 δευτερόλεπτα
        setTimeout(() => fetchBalance(), 2000);
      } else {
        // Αν αποτύχουμε MAX_RETRIES φορές, εμφανίζουμε μήνυμα σφάλματος
        const errorMessage = "Δεν ήταν δυνατή η φόρτωση του υπολοίπου. Προσπαθήστε ξανά αργότερα.";
        setConnectionError(errorMessage);
        toast.error(errorMessage);
      }
      return null;
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, connection, retryCount]);

  // Φόρτωση tokens
  const fetchTokens = useCallback(async () => {
    if (!publicKey) return [];
    
    try {
      setIsLoadingTokens(true);
      setConnectionError(null);
      
      // Χρήση του tokenService για τη φόρτωση των tokens
      const userTokens = await tokenService.getTokenAccounts(publicKey.toString());
      
      setTokens(userTokens);
      setRetryCount(0); // Επιτυχία, μηδενίζουμε τις επαναπροσπάθειες
      return userTokens;
    } catch (err) {
      console.error('Σφάλμα φόρτωσης tokens:', err);
      
      // Αν είναι η πρώτη αποτυχία, δοκιμάζουμε ξανά μετά από λίγο
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        const errorMessage = "Πρόβλημα φόρτωσης tokens. Δοκιμάζουμε ξανά...";
        setConnectionError(errorMessage);
        // Δοκιμάζουμε ξανά μετά από 2 δευτερόλεπτα
        setTimeout(() => fetchTokens(), 2000);
      } else {
        // Αν αποτύχουμε MAX_RETRIES φορές, εμφανίζουμε μήνυμα σφάλματος
        const errorMessage = "Δεν ήταν δυνατή η φόρτωση των tokens. Προσπαθήστε ξανά αργότερα.";
        setConnectionError(errorMessage);
        toast.error(errorMessage);
      }
      
      return [];
    } finally {
      setIsLoadingTokens(false);
    }
  }, [publicKey, retryCount]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      if (wallet) {
        setConnectionError(null);
        toast.loading('Σύνδεση με το πορτοφόλι...');
        await connect();
        toast.success('Επιτυχής σύνδεση με το πορτοφόλι');
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
      setRetryCount(0);
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
