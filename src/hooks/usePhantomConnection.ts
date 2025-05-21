import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useErrorReporting } from './useErrorReporting';
import { Token } from '@/types/wallet';

export function usePhantomConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setIsConnecting(true);
      
      if (!isPhantomInstalled()) {
        setError('Please install Phantom Wallet extension');
        toast.error('Phantom wallet not detected', {
          description: 'Please install the Phantom browser extension',
        });
        return;
      }

      const solana = window.phantom?.solana;
      const { publicKey } = await solana.connect();
      const address = publicKey.toString();
      
      setWalletAddress(address);
      setIsConnected(true);
      
      // Get SOL balance
      await refreshWalletData(address);
      
      // Save connection in localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', address);
      
      toast.success('Wallet connected successfully');
      
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      if (err instanceof Error) {
        setError(err.message);
        reportError(err, {
          component: 'PhantomConnection', 
          source: 'client',
          details: { action: 'connectWallet' }
        });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isPhantomInstalled, reportError]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      const solana = window.phantom?.solana;
      if (solana) {
        await solana.disconnect();
      }
      
      setWalletAddress(null);
      setIsConnected(false);
      setSolBalance(0);
      setTokens([]);
      
      // Clear from localStorage
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAddress');
      
      toast.success('Wallet disconnected');
      
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
      if (err instanceof Error) {
        reportError(err, {
          component: 'PhantomConnection',
          source: 'client',
          details: { action: 'disconnectWallet' }
        });
      }
    }
  }, [reportError]);

  // Refresh wallet data
  const refreshWalletData = useCallback(async (address: string) => {
    if (!address) return;
    
    setIsLoadingTokens(true);
    try {
      // Get SOL balance (simplified for demo purposes)
      const solBalance = Math.random() * 10;
      setSolBalance(solBalance);
      
      // Demo tokens - In a real app, this would fetch from blockchain
      const mockTokens: Token[] = [
        {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          symbol: 'USDC',
          name: 'USD Coin',
          amount: Math.random() * 1000,
          decimals: 6,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        },
        {
          address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          symbol: 'USDT',
          name: 'USDT',
          amount: Math.random() * 500,
          decimals: 6,
          mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
        },
        {
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Wrapped SOL',
          amount: solBalance,
          decimals: 9,
          mint: 'So11111111111111111111111111111111111111112',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        },
      ];
      
      setTokens(mockTokens);
    } catch (err) {
      console.error('Failed to refresh wallet data:', err);
      if (err instanceof Error) {
        reportError(err, {
          component: 'PhantomConnection',
          source: 'client',
          details: { action: 'refreshWalletData', address }
        });
      }
    } finally {
      setIsLoadingTokens(false);
    }
  }, [reportError]);

  // Select token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const selectedToken = tokens.find(token => token.address === tokenAddress);
    if (selectedToken) {
      // In a real app, this would update the state in a trading context
      console.log('Selected token for trading:', selectedToken);
      return selectedToken;
    }
    return null;
  }, [tokens]);

  // Check for previously connected wallet
  useEffect(() => {
    const checkSavedConnection = async () => {
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (wasConnected && savedAddress && isPhantomInstalled()) {
        try {
          const solana = window.phantom?.solana;
          if (solana.isConnected) {
            setWalletAddress(savedAddress);
            setIsConnected(true);
            await refreshWalletData(savedAddress);
          }
        } catch (err) {
          console.error('Failed to reconnect to wallet:', err);
          localStorage.removeItem('walletConnected');
          localStorage.removeItem('walletAddress');
        }
      }
    };
    
    checkSavedConnection();
  }, [isPhantomInstalled, refreshWalletData]);

  return {
    isConnected,
    isConnecting,
    walletAddress,
    solBalance,
    tokens,
    isLoadingTokens,
    error,
    isPhantomInstalled: isPhantomInstalled(),
    connectWallet,
    disconnectWallet,
    refreshWalletData: () => walletAddress && refreshWalletData(walletAddress),
    selectTokenForTrading
  };
}
