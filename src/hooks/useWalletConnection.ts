
import { useState, useEffect, useCallback } from 'react';
import { Token } from '@/types/wallet';

export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenPrices, setTokenPrices] = useState<Record<string, { price: number, priceChange24h: number }>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);

  const loadMockTokens = useCallback(async () => {
    setIsLoadingTokens(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockTokens: Token[] = [
      {
        address: 'So11111111111111111111111111111111111111112',
        name: 'Solana',
        symbol: 'SOL',
        amount: 1.5,
        decimals: 9
      },
      {
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        name: 'USD Coin',
        symbol: 'USDC',
        amount: 100,
        decimals: 6
      }
    ];
    
    const mockPrices: Record<string, { price: number, priceChange24h: number }> = {
      'So11111111111111111111111111111111111111112': { price: 125.34, priceChange24h: 3.4 },
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { price: 1, priceChange24h: 0.01 }
    };
    
    setTokens(mockTokens);
    setTokenPrices(mockPrices);
    setIsLoadingTokens(false);
  }, []);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful connection
      setIsConnected(true);
      setWalletAddress('3Gf7Ck4rKGpGKyGPCfgmQA3CTKnDDXsKj5E1kRb8GhBn');
      setSolBalance(3.75);
      
      // Load tokens after connection
      await loadMockTokens();
      
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [loadMockTokens]);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setWalletAddress('');
    setSolBalance(0);
    setTokens([]);
  }, []);

  // Refresh wallet data
  const refreshWalletData = useCallback(async () => {
    if (!isConnected) return;
    
    setIsLoadingTokens(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Refresh SOL balance with small random change
    setSolBalance(prev => prev + (Math.random() * 0.2 - 0.1));
    
    // Refresh tokens
    await loadMockTokens();
  }, [isConnected, loadMockTokens]);

  // Mock function for selecting a token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    console.log(`Selected token for trading: ${tokenAddress}`);
    return tokenAddress;
  }, []);

  return {
    isConnected,
    isConnecting,
    walletAddress,
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading
  };
}
