
import { useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from 'sonner';
import { 
  saveWalletToLocalStorage,
  saveWalletToSupabase,
  removeWalletFromStorage,
  getWalletFromLocalStorage
} from '@/utils/walletStorage';
import {
  isPhantomInstalled,
  connectTrustedPhantomWallet,
  connectPhantomWallet,
  disconnectPhantomWallet
} from '@/utils/phantomWallet';

export function usePersistentWallet() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabaseAuth();
  
  // Load saved wallet connection from localStorage
  useEffect(() => {
    const loadSavedWalletConnection = async () => {
      try {
        // First check localStorage for quick reconnect
        const savedWallet = getWalletFromLocalStorage();
        if (savedWallet && savedWallet.address && savedWallet.timestamp) {
          // Check if wallet connection is not too old (24 hours)
          const now = Date.now();
          if (now - savedWallet.timestamp < 24 * 60 * 60 * 1000) {
            // Try to reconnect if Phantom is installed
            const address = await connectTrustedPhantomWallet();
            
            if (address && address === savedWallet.address) {
              setWalletAddress(address);
              setIsConnected(true);
              console.log('Auto-reconnected to wallet:', address);
              
              // Update connection timestamp
              saveWalletToLocalStorage(address);
              
              // If user is logged in, update Supabase record
              if (user) {
                await saveWalletToSupabase(address, user.id);
              }
              return;
            }
          }
        }
      } catch (err) {
        console.error('Error loading saved wallet:', err);
      }
    };
    
    loadSavedWalletConnection();
  }, [user]);
  
  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const address = await connectPhantomWallet();
      
      if (address) {
        // Save to state
        setWalletAddress(address);
        setIsConnected(true);
        
        // Save to localStorage
        saveWalletToLocalStorage(address);
        
        // Save to Supabase if user is logged in
        if (user) {
          await saveWalletToSupabase(address, user.id);
        }
        
        return address;
      }
      return null;
    } catch (err: any) {
      console.error('Connection error:', err);
      const errorMsg = err.message || 'Αποτυχία σύνδεσης με το πορτοφόλι';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [user]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      const success = await disconnectPhantomWallet();
      
      if (success) {
        // Clear local state
        setIsConnected(false);
        setWalletAddress('');
        
        // Remove from localStorage
        if (walletAddress) {
          await removeWalletFromStorage(walletAddress, user?.id);
        }
      }
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      const errorMsg = 'Αποτυχία αποσύνδεσης πορτοφολιού';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }, [walletAddress, user?.id]);

  return {
    walletAddress,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isPhantomInstalled: isPhantomInstalled()
  };
}
