
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from 'sonner';
import { solanaService } from '@/services/solana';

export function usePersistentWallet() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabaseAuth();
  
  // Load saved wallet connection from localStorage or Supabase
  useEffect(() => {
    const loadSavedWalletConnection = async () => {
      try {
        // First check localStorage for quick reconnect
        const savedWallet = localStorage.getItem('phantom_wallet');
        if (savedWallet) {
          const wallet = JSON.parse(savedWallet);
          if (wallet && wallet.address && wallet.timestamp) {
            // Check if wallet connection is not too old (24 hours)
            const now = Date.now();
            if (now - wallet.timestamp < 24 * 60 * 60 * 1000) {
              // Try to reconnect if Phantom is installed
              if (window.phantom?.solana) {
                try {
                  const phantom = window.phantom.solana;
                  // Only try to reconnect if trusted
                  const response = await phantom.connect({ onlyIfTrusted: true });
                  
                  if (response && response.publicKey && response.publicKey.toString() === wallet.address) {
                    setWalletAddress(wallet.address);
                    setIsConnected(true);
                    console.log('Auto-reconnected to wallet:', wallet.address);
                    
                    // Update connection timestamp
                    saveWalletToLocalStorage(wallet.address);
                    
                    // If user is logged in, update Supabase record
                    if (user) {
                      await saveWalletToSupabase(wallet.address);
                    }
                    return;
                  }
                } catch (err) {
                  // Silent fail - user might have revoked access or Phantom settings changed
                  console.log('Could not auto-reconnect to wallet:', err);
                }
              }
            }
          }
        }
        
        // If we have a logged in user, check for wallets in Supabase
        if (user) {
          const { data: wallets, error } = await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_primary', true)
            .order('last_connected', { ascending: false })
            .limit(1);
            
          if (!error && wallets && wallets.length > 0) {
            const primaryWallet = wallets[0];
            
            // Try to reconnect if Phantom is installed
            if (window.phantom?.solana) {
              try {
                const phantom = window.phantom.solana;
                // Only try to reconnect if trusted
                const response = await phantom.connect({ onlyIfTrusted: true });
                
                if (response && response.publicKey && response.publicKey.toString() === primaryWallet.address) {
                  setWalletAddress(primaryWallet.address);
                  setIsConnected(true);
                  console.log('Auto-reconnected to wallet from database:', primaryWallet.address);
                  
                  // Update connection timestamp
                  saveWalletToLocalStorage(primaryWallet.address);
                  
                  // Update last_connected in Supabase (convert Date to ISO string)
                  await supabase
                    .from('wallets')
                    .update({ last_connected: new Date().toISOString() })
                    .eq('id', primaryWallet.id);
                    
                  return;
                }
              } catch (err) {
                // Silent fail - will fallback to manual connect
                console.log('Could not auto-reconnect to wallet from database:', err);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error loading saved wallet:', err);
      }
    };
    
    loadSavedWalletConnection();
  }, [user]);
  
  // Save wallet to localStorage for quick reconnect
  const saveWalletToLocalStorage = (address: string) => {
    localStorage.setItem('phantom_wallet', JSON.stringify({
      address,
      timestamp: Date.now()
    }));
  };
  
  // Save wallet to Supabase if user is logged in
  const saveWalletToSupabase = async (address: string) => {
    if (!user) return;
    
    try {
      // Check if this wallet already exists for this user
      const { data: existingWallets } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('address', address);
        
      if (existingWallets && existingWallets.length > 0) {
        // Update existing wallet
        await supabase
          .from('wallets')
          .update({
            last_connected: new Date().toISOString(),
            is_primary: true
          })
          .eq('id', existingWallets[0].id);
          
        // Set all other wallets as non-primary
        await supabase
          .from('wallets')
          .update({ is_primary: false })
          .eq('user_id', user.id)
          .neq('id', existingWallets[0].id);
      } else {
        // Set all existing wallets as non-primary
        await supabase
          .from('wallets')
          .update({ is_primary: false })
          .eq('user_id', user.id);
          
        // Create new wallet record
        await supabase
          .from('wallets')
          .insert({
            address,
            user_id: user.id,
            blockchain: 'solana',
            is_primary: true,
            last_connected: new Date().toISOString()
          });
      }
    } catch (err) {
      console.error('Error saving wallet to database:', err);
    }
  };
  
  // Connect wallet
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
        return null;
      }

      toast.loading('Σύνδεση με το Phantom wallet...');
      
      const response = await phantom.connect();
      
      if (response && response.publicKey) {
        const address = response.publicKey.toString();
        console.log('Connected to wallet:', address);
        
        // Save to state
        setWalletAddress(address);
        setIsConnected(true);
        
        // Save to localStorage
        saveWalletToLocalStorage(address);
        
        // Save to Supabase if user is logged in
        if (user) {
          await saveWalletToSupabase(address);
        }
        
        toast.success('Το πορτοφόλι συνδέθηκε επιτυχώς');
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
      toast.dismiss();
    }
  }, [user]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      const phantom = window.phantom?.solana;
      
      if (phantom && phantom.isPhantom) {
        toast.loading('Αποσύνδεση πορτοφολιού...');
        await phantom.disconnect();
        
        // Clear local state
        setIsConnected(false);
        setWalletAddress('');
        
        // Remove from localStorage
        localStorage.removeItem('phantom_wallet');
        
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

  return {
    walletAddress,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isPhantomInstalled: Boolean(window.phantom?.solana?.isPhantom)
  };
}

// Define type for window.phantom
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom: boolean;
        connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<any>;
        disconnect: () => Promise<void>;
        // Adding missing methods that TypeScript is expecting
        on?: (event: string, callback: Function) => void;
        off?: (event: string, callback: Function) => void;
      };
    };
  }
}
