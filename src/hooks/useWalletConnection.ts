
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { walletService, tokensService } from '@/services/database';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { toast } from 'sonner';

export type Transaction = {
  signature: string;
  blockTime: number;
  type: string;
  status: string;
  amount: string;
  from: string;
  to: string;
};

export type Token = {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  logo?: string;
};

export function useWalletConnection() {
  const { user } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([
    { 
      address: 'So11111111111111111111111111111111111111112', 
      name: 'Solana', 
      symbol: 'SOL', 
      amount: 2.5,
      logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png'
    },
    { 
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 
      name: 'USD Coin', 
      symbol: 'USDC', 
      amount: 158.42,
      logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
    },
    { 
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', 
      name: 'Raydium', 
      symbol: 'RAY', 
      amount: 50,
      logo: 'https://raw.githubusercontent.com/raydium-io/media-assets/master/logo.png'
    }
  ]);

  // Load wallet from database if user is logged in
  useEffect(() => {
    const loadSavedWallet = async () => {
      if (!user?.id) return;
      
      try {
        const wallet = await walletService.getPrimaryWallet(user.id);
        if (wallet) {
          setWalletAddress(wallet.address);
          await fetchBalance(wallet.address);
          setIsConnected(true);
          toast.success('Το πορτοφόλι συνδέθηκε αυτόματα');
        }
      } catch (err) {
        console.error('Error loading saved wallet:', err);
        toast.error('Αποτυχία αυτόματης σύνδεσης πορτοφολιού');
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
            await fetchBalance(address);
            setIsConnected(true);
            
            // Save wallet to database if user is logged in
            if (user?.id) {
              try {
                await walletService.saveWalletAddress(user.id, address);
              } catch (err) {
                console.error('Error saving wallet to database:', err);
              }
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

  // Helper function to check if Phantom is installed
  const checkPhantomWalletInstalled = () => {
    if (typeof window === 'undefined') return false;
    return window.phantom?.solana && window.phantom.solana.isPhantom;
  };

  // Helper function to fetch balance
  const fetchBalance = async (address: string) => {
    try {
      const phantom = window.phantom?.solana;
      if (!phantom) return;

      // For demo purposes, we'll just set a mock balance
      // In a real app, you'd fetch this from the Solana blockchain
      setBalance(5.25);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch wallet balance');
    }
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
        await fetchBalance(address);
        setIsConnected(true);
        
        // Save wallet to database if user is logged in
        if (user?.id) {
          try {
            await walletService.saveWalletAddress(user.id, address);
            
            // Also save tokens to database
            await tokensService.saveTokens(user.id, tokens);
            
            toast.success('Το πορτοφόλι συνδέθηκε και αποθηκεύτηκε στο λογαριασμό σας');
          } catch (err) {
            console.error('Error saving wallet to database:', err);
            toast.error('Το πορτοφόλι συνδέθηκε αλλά απέτυχε η αποθήκευση στο λογαριασμό σας');
          }
        } else {
          toast.success('Το πορτοφόλι συνδέθηκε επιτυχώς');
        }
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      let errorMsg = 'Αποτυχία σύνδεσης πορτοφολιού';
      if (err instanceof Error) {
        errorMsg += `: ${err.message}`;
      }
      setError(errorMsg);
      toast.error(errorMsg);
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

  // Get solBalance from the balance state
  const solBalance = balance || 0;

  return {
    walletAddress,
    balance,
    solBalance,
    tokens,
    isConnected,
    isConnecting,
    error,
    isPhantomInstalled: checkPhantomWalletInstalled(),
    connectWallet,
    disconnectWallet,
  };
}

// Add Phantom wallet type definitions
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom: boolean;
        connect: (options?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
        disconnect: () => Promise<void>;
      };
    };
  }
}
