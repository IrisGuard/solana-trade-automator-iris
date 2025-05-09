
import { useState, useEffect } from 'react';

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
            setWalletAddress(response.publicKey.toString());
            await fetchBalance(response.publicKey.toString());
            setIsConnected(true);
          }
        }
      } catch (err) {
        console.log('No trusted connection:', err);
        // This is not an error, just means the user hasn't connected before
      }
    };

    checkWalletConnection();
  }, []);

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
        setError('Phantom wallet not found! Please install it.');
        setIsConnecting(false);
        return;
      }

      const response = await phantom.connect();
      
      if (response && response.publicKey) {
        const address = response.publicKey.toString();
        setWalletAddress(address);
        await fetchBalance(address);
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const phantom = window.phantom?.solana;
      
      if (phantom && phantom.isPhantom) {
        await phantom.disconnect();
        setIsConnected(false);
        setWalletAddress('');
        setBalance(null);
      }
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
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
