
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { useErrorReporting } from './useErrorReporting';
import { WalletName } from '@solana/wallet-adapter-base';

export function useSolanaWallet() {
  const { connection } = useConnection();
  const { publicKey, connected, connecting, select, disconnect } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { reportError } = useErrorReporting();
  
  // Φορτώνει το υπόλοιπο SOL όταν συνδέεται το πορτοφόλι
  useEffect(() => {
    let mounted = true;
    
    const loadBalance = async () => {
      if (!publicKey || !connection) return;
      
      setIsLoading(true);
      try {
        const lamports = await connection.getBalance(publicKey);
        const solBalance = lamports / LAMPORTS_PER_SOL;
        
        if (mounted) {
          setBalance(solBalance);
        }
      } catch (error) {
        console.error('Error fetching SOL balance:', error);
        reportError(error as Error, {
          component: 'SolanaWallet',
          details: { action: 'getBalance' },
          source: 'client'
        });
        
        if (mounted) {
          setBalance(null);
          toast.error('Failed to load wallet balance');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    if (connected && publicKey) {
      loadBalance();
    } else {
      setBalance(null);
    }
    
    return () => {
      mounted = false;
    };
  }, [connection, publicKey, connected, reportError]);
  
  // Μέθοδος για χειροκίνητη ανανέωση υπολοίπου
  const refreshBalance = async () => {
    if (!publicKey || !connection) {
      return;
    }
    
    setIsLoading(true);
    try {
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error refreshing SOL balance:', error);
      reportError(error as Error, {
        component: 'SolanaWallet',
        details: { action: 'refreshBalance' },
        source: 'client'
      });
      toast.error('Failed to refresh wallet balance');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Μέθοδος για σύνδεση πορτοφολιού με συγκεκριμένο provider
  const connectWallet = (providerName: string) => {
    try {
      // Instead of casting, we use the WalletName for typesafety
      // This assumes providerName is one of the valid wallet names
      select(providerName as unknown as WalletName);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      reportError(error as Error, {
        component: 'SolanaWallet',
        details: { action: 'connectWallet', provider: providerName },
        source: 'client'
      });
      toast.error('Failed to connect wallet');
    }
  };
  
  return {
    address: publicKey?.toString() || null,
    connected,
    connecting,
    balance,
    isLoading,
    connectWallet,
    disconnectWallet: disconnect,
    refreshBalance
  };
}
