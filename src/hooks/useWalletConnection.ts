
import { useState, useEffect, useCallback } from 'react';
import { useErrorReporting } from './useErrorReporting';
import { Token, WalletStatus } from '@/types/wallet';

// Sample data for demonstration
const sampleTokens: Token[] = [
  {
    address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
    symbol: 'SOL',
    name: 'Solana',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    decimals: 9,
    amount: 2.5
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    name: 'USD Coin',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    decimals: 6,
    amount: 150.75
  }
];

export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [tokens, setTokens] = useState<Token[]>(sampleTokens);
  const [balance, setBalance] = useState<number>(0);
  const { reportError } = useErrorReporting();

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful connection
      setIsConnected(true);
      setWalletAddress('8xft7ixwvoK21LE2X5k7QQ4mF51HuKAKQ6Z1wNhWm2Kk');
      setBalance(2.5);
      
      return true;
    } catch (error) {
      reportError(error as Error, { component: 'WalletConnection', source: 'wallet' });
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [reportError]);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setWalletAddress(undefined);
    setBalance(0);
  }, []);

  return {
    isConnected,
    isConnecting,
    walletAddress,
    tokens,
    balance,
    connectWallet,
    disconnectWallet
  };
}
