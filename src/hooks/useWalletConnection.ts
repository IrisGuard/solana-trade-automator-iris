
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Token } from '@/types/wallet';
import { isPhantomInstalled } from '@/utils/phantomWallet';

export interface Wallet {
  address: string;
  publicKey: string;
}

export const useWalletConnection = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, { price: number, priceChange24h: number }>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Disconnect wallet function
  const handleDisconnect = useCallback(async (): Promise<void> => {
    try {
      setWallet(null);
      setIsConnected(false);
      setWalletAddress('');
      localStorage.removeItem('wallet');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return Promise.resolve();
    } catch (error) {
      console.error('Disconnect error:', error);
      return Promise.reject(error);
    }
  }, []);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      // Mock connection for now
      const mockWallet = { address: '123456789abcdef', publicKey: '123456789abcdef' };
      setWallet(mockWallet);
      setIsConnected(true);
      setWalletAddress(mockWallet.address);
      
      // Simulate loading some data
      await new Promise(resolve => setTimeout(resolve, 500));
      setSolBalance(Math.random() * 10);
      
      return mockWallet.address;
    } catch (err) {
      setError('Failed to connect wallet');
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Refresh wallet data
  const refreshWalletData = useCallback(() => {
    if (!isConnected) return;
    
    // Mock refreshing data
    setSolBalance(Math.random() * 10);
  }, [isConnected]);

  // Select token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    return token || null;
  }, [tokens]);

  useEffect(() => {
    const initWallet = async () => {
      const storedWallet = localStorage.getItem('wallet');
      if (storedWallet) {
        const parsedWallet = JSON.parse(storedWallet);
        setWallet(parsedWallet);
        setIsConnected(true);
        setWalletAddress(parsedWallet.address);
      }
    };
    initWallet();
  }, []);

  return {
    wallet,
    handleDisconnect,
    isConnected,
    isConnecting,
    walletAddress,
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    error,
    connectWallet,
    disconnectWallet: handleDisconnect,
    refreshWalletData,
    selectTokenForTrading,
    isPhantomInstalled: isPhantomInstalled()
  };
};
