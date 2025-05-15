
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Wallet } from '@/types/wallet';

export const useWalletConnection = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const handleDisconnect = useCallback(async (): Promise<void> => {
    try {
      setWallet(null);
      localStorage.removeItem('wallet');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return Promise.resolve();
    } catch (error) {
      console.error('Disconnect error:', error);
      return Promise.reject(error);
    }
  }, []);

  useEffect(() => {
    const initWallet = async () => {
      const storedWallet = localStorage.getItem('wallet');
      if (storedWallet) {
        setWallet(JSON.parse(storedWallet));
      }
    };
    initWallet();
  }, []);

  return {
    wallet,
    handleDisconnect
  };
};
