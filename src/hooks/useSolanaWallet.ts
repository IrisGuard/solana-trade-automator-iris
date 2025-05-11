
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Token } from '@/types/wallet';

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

  // Φόρτωση υπολοίπου
  const fetchBalance = useCallback(async () => {
    if (!publicKey) return null;

    try {
      setIsLoadingBalance(true);
      const balanceInLamports = await connection.getBalance(publicKey);
      const solBalance = balanceInLamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
      return solBalance;
    } catch (error) {
      console.error("Σφάλμα κατά τη φόρτωση του υπολοίπου:", error);
      toast.error("Δεν ήταν δυνατή η φόρτωση του υπολοίπου");
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
      toast.loading('Φόρτωση tokens...');
      
      // Χρήση του solanaService για τη φόρτωση των tokens
      // Εδώ θα χρησιμοποιήσουμε έτοιμη λειτουργικότητα από την εφαρμογή
      const { getTokenAccounts } = await import('@/services/solanaService');
      const userTokens = await getTokenAccounts(publicKey.toString());
      
      setTokens(userTokens);
      toast.success('Τα tokens φορτώθηκαν επιτυχώς');
      return userTokens;
    } catch (err) {
      console.error('Σφάλμα φόρτωσης tokens:', err);
      toast.error('Σφάλμα κατά τη φόρτωση των tokens');
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
        toast.loading('Σύνδεση με το πορτοφόλι...');
        await connect();
        return true;
      } else {
        toast.error('Επιλέξτε ένα πορτοφόλι πρώτα');
        return false;
      }
    } catch (error) {
      console.error('Σφάλμα σύνδεσης πορτοφολιού:', error);
      toast.error('Δεν ήταν δυνατή η σύνδεση με το πορτοφόλι');
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
      return true;
    } catch (error) {
      console.error('Σφάλμα αποσύνδεσης πορτοφολιού:', error);
      toast.error('Δεν ήταν δυνατή η αποσύνδεση του πορτοφολιού');
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
    selectWallet: select,
    connectWallet,
    disconnectWallet,
    fetchBalance,
    fetchTokens
  };
}
