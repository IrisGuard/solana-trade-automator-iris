
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Token {
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  logo?: string;
  address: string;
}

export interface Transaction {
  signature: string;
  blockTime: number;
  type: string;
  status: string;
  amount?: string;
  from?: string;
  to?: string;
}

export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [solBalance, setSolBalance] = useState(0);
  const [tokens, setTokens] = useState<Token[]>([]);

  // Check if Phantom is installed
  const getProvider = () => {
    if ('phantom' in window) {
      // @ts-ignore
      const provider = window.phantom?.solana;
      
      if (provider?.isPhantom) {
        return provider;
      }
    }
    
    window.open('https://phantom.app/', '_blank');
    return null;
  };

  // Connect to Phantom wallet
  const connectWallet = async () => {
    try {
      const provider = getProvider();
      
      if (!provider) {
        toast.error('Phantom wallet is not installed!');
        return;
      }
      
      // Connect to wallet
      const response = await provider.connect();
      const address = response.publicKey.toString();
      
      setWalletAddress(address);
      setIsConnected(true);
      
      // Fetch balance and tokens
      await fetchWalletData(address);
      
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    try {
      const provider = getProvider();
      if (provider) {
        provider.disconnect();
      }
      
      setIsConnected(false);
      setWalletAddress('');
      setSolBalance(0);
      setTokens([]);
      
      toast.info('Wallet disconnected.');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet.');
    }
  };
  
  // Fetch wallet data (balance and tokens)
  const fetchWalletData = async (address: string) => {
    try {
      // In a real implementation, these would be actual API calls to Solana
      // For now, we'll simulate the data
      
      // Simulate SOL balance
      setSolBalance(12.45);
      
      // Simulate tokens
      setTokens([
        { 
          name: 'Solana', 
          symbol: 'SOL', 
          amount: 12.45, 
          decimals: 9,
          address: 'So11111111111111111111111111111111111111112',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        },
        { 
          name: 'USD Coin', 
          symbol: 'USDC', 
          amount: 250.75, 
          decimals: 6,
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        },
        { 
          name: 'Raydium', 
          symbol: 'RAY', 
          amount: 75.5, 
          decimals: 6,
          address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png'
        },
        { 
          name: 'Jupiter', 
          symbol: 'JUP', 
          amount: 120, 
          decimals: 6,
          address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png'
        }
      ]);
      
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      toast.error('Failed to load wallet data.');
    }
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnectedWallet = async () => {
      try {
        const provider = getProvider();
        if (provider && provider.isConnected) {
          const address = provider.publicKey.toString();
          setWalletAddress(address);
          setIsConnected(true);
          await fetchWalletData(address);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };
    
    checkConnectedWallet();
  }, []);

  return {
    isConnected,
    walletAddress,
    solBalance,
    tokens,
    connectWallet,
    disconnectWallet
  };
}
