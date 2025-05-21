
import { useState, useEffect, useCallback } from 'react';
import { Token } from '@/types/wallet';
import { useWalletAddress } from './wallet/useWalletAddress';
import { useWalletBalance } from './wallet/useWalletBalance';
import { TokenPrice } from '@/services/solana/price/types';

export function useWalletConnection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, TokenPrice>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  
  // Use wallet hooks
  const { walletAddress, isConnected, setWalletAddress, setIsConnected } = useWalletAddress();
  const { solBalance, isLoading: loadingBalance, loadSolBalance } = useWalletBalance();
  
  // Connect wallet function
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Mock connection for demo
      const address = 'demoWallet' + Math.floor(Math.random() * 1000000);
      setWalletAddress(address);
      setIsConnected(true);
      localStorage.setItem('walletAddress', address);
      
      // Load wallet data
      await loadWalletData(address);
      
      return true;
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [setWalletAddress, setIsConnected]);
  
  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setIsConnected(false);
    setTokens([]);
    localStorage.removeItem('walletAddress');
    return true;
  }, [setWalletAddress, setIsConnected]);
  
  // Load wallet data function
  const loadWalletData = useCallback(async (address: string) => {
    if (!address) return false;
    
    setIsLoadingTokens(true);
    
    try {
      // Load SOL balance
      if (loadSolBalance) {
        await loadSolBalance(address);
      }
      
      // Mock token data for demo
      const mockTokens: Token[] = [
        {
          address: 'solaB1u14nkGPEMULDJVq75CvGRR47eWuDQj745iSr1',
          symbol: 'SOL',
          name: 'Solana',
          amount: 2.5,
          decimals: 9,
          mint: 'So11111111111111111111111111111111111111112',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        },
        {
          address: 'usdcB1u14nkGPEMULDJVq75CvGRR47eWuDQj745iSr1',
          symbol: 'USDC',
          name: 'USD Coin',
          amount: 150.75,
          decimals: 6,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        },
        {
          address: 'rayB1u14nkGPEMULDJVq75CvGRR47eWuDQj745iSr1',
          symbol: 'RAY',
          name: 'Raydium',
          amount: 50,
          decimals: 6,
          mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png'
        }
      ];
      
      // Mock token prices
      const mockTokenPrices: Record<string, TokenPrice> = {
        'solaB1u14nkGPEMULDJVq75CvGRR47eWuDQj745iSr1': {
          price: 160.25,
          priceChange24h: 3.5
        },
        'usdcB1u14nkGPEMULDJVq75CvGRR47eWuDQj745iSr1': {
          price: 1.0,
          priceChange24h: 0.01
        },
        'rayB1u14nkGPEMULDJVq75CvGRR47eWuDQj745iSr1': {
          price: 1.25,
          priceChange24h: -2.3
        }
      };
      
      setTokens(mockTokens);
      setTokenPrices(mockTokenPrices);
      return true;
    } catch (err) {
      console.error('Failed to load wallet data:', err);
      setError(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setIsLoadingTokens(false);
    }
  }, [loadSolBalance]);

  // Refresh wallet data function
  const refreshWalletData = useCallback(() => {
    if (walletAddress) {
      return loadWalletData(walletAddress);
    }
    return Promise.resolve(false);
  }, [walletAddress, loadWalletData]);
  
  // Select token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string): Token | null => {
    const token = tokens.find(t => t.address === tokenAddress);
    return token || null;
  }, [tokens]);
  
  // Check for previously connected wallet
  useEffect(() => {
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet && !isConnected) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
      loadWalletData(savedWallet);
    }
  }, [isConnected, loadWalletData, setIsConnected, setWalletAddress]);
  
  return {
    isConnected,
    isConnecting,
    walletAddress,
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    loading: loadingBalance || isLoadingTokens,
    error,
    connectWallet,
    disconnectWallet,
    loadWalletData,
    refreshWalletData,
    selectTokenForTrading,
    isPhantomInstalled: true // Mock value
  };
}
