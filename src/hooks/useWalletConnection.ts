
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useErrorReporting } from './useErrorReporting';
import { useSolanaWallet } from './useSolanaWallet';
import { Token } from '@/types/wallet';

export function useWalletConnection() {
  const { address, connected, connecting, balance, refreshBalance, connectWallet: connectSolana, disconnectWallet } = useSolanaWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, { price: number, priceChange24h: number }>>({});
  const { reportError } = useErrorReporting();

  // Check if Phantom is installed
  const isPhantomInstalled = useCallback(() => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      return provider?.isPhantom || false;
    }
    return false;
  }, []);

  // Connect to wallet
  const connectWallet = useCallback(async () => {
    try {
      setError(null);
      
      if (!isPhantomInstalled()) {
        const errorMessage = 'Please install Phantom Wallet extension';
        setError(errorMessage);
        toast.error('Phantom wallet not detected', {
          description: 'Please install the Phantom browser extension',
        });
        return;
      }

      await connectSolana('phantom');
      
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      if (err instanceof Error) {
        setError(err.message);
        reportError(err, {
          component: 'WalletConnection', 
          source: 'client',
          details: { action: 'connectWallet' }
        });
      }
    }
  }, [isPhantomInstalled, connectSolana, reportError]);

  // Refresh wallet data
  const refreshWalletData = useCallback(async () => {
    if (!address) return;
    
    setIsLoadingTokens(true);
    try {
      // Refresh SOL balance
      await refreshBalance();
      
      // Get token list (simplified for demo purposes)
      const mockTokens: Token[] = [
        {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          symbol: 'USDC',
          name: 'USD Coin',
          amount: Math.random() * 1000,
          decimals: 6,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
        },
        {
          address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          symbol: 'USDT',
          name: 'USDT',
          amount: Math.random() * 500,
          decimals: 6,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
        },
        {
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Wrapped SOL',
          amount: balance || Math.random() * 10,
          decimals: 9,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        },
      ];
      
      setTokens(mockTokens);
      
      // Mock prices for tokens
      const prices: Record<string, { price: number, priceChange24h: number }> = {};
      mockTokens.forEach(token => {
        prices[token.address] = {
          price: token.symbol === 'SOL' 
            ? 20 + (Math.random() * 5)
            : token.symbol === 'USDC' || token.symbol === 'USDT' 
              ? 0.95 + (Math.random() * 0.1) 
              : Math.random() * 100,
          priceChange24h: (Math.random() * 10) - 5 // Between -5% and +5%
        };
      });
      
      setTokenPrices(prices);
      
    } catch (err) {
      console.error('Failed to refresh wallet data:', err);
      if (err instanceof Error) {
        reportError(err, {
          component: 'WalletConnection',
          source: 'client',
          details: { action: 'refreshWalletData' }
        });
      }
    } finally {
      setIsLoadingTokens(false);
    }
  }, [address, balance, refreshBalance, reportError]);

  // Select token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const selectedToken = tokens.find(token => token.address === tokenAddress);
    if (selectedToken) {
      console.log('Selected token for trading:', selectedToken);
      return selectedToken;
    }
    return null;
  }, [tokens]);

  // Load tokens when wallet is connected
  useEffect(() => {
    if (connected && address) {
      refreshWalletData();
    }
  }, [connected, address, refreshWalletData]);

  return {
    isConnected: connected,
    isConnecting: connecting,
    walletAddress: address,
    solBalance: balance || 0,
    tokens,
    tokenPrices,
    isLoadingTokens,
    error,
    isPhantomInstalled: isPhantomInstalled(),
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading
  };
}
