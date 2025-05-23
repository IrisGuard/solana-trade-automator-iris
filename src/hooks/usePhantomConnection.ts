
import { useState, useEffect } from 'react';
import { isPhantomInstalled } from '@/utils/phantomWallet';
import { Token } from '@/types/wallet';

export function usePhantomConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (isPhantomInstalled()) {
        try {
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          if (resp.publicKey) {
            setIsConnected(true);
            setWalletAddress(resp.publicKey.toString());
            await loadTokens(resp.publicKey.toString());
          }
        } catch (err) {
          // User is not connected
        }
      }
    };

    checkConnection();
  }, []);

  const loadTokens = async (address: string) => {
    setIsLoadingTokens(true);
    try {
      // Mock tokens for demo
      const mockTokens: Token[] = [
        {
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          amount: 2.5,
          decimals: 9,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        },
        {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          symbol: 'USDC',
          name: 'USD Coin',
          amount: 100,
          decimals: 6,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        }
      ];
      setTokens(mockTokens);
    } catch (error) {
      console.error('Error loading tokens:', error);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  const connect = async () => {
    if (!isPhantomInstalled()) return;
    
    setIsConnecting(true);
    try {
      const resp = await window.solana.connect();
      setIsConnected(true);
      setWalletAddress(resp.publicKey.toString());
      await loadTokens(resp.publicKey.toString());
    } catch (err) {
      console.error('Failed to connect:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (window.solana) {
      await window.solana.disconnect();
      setIsConnected(false);
      setWalletAddress(null);
      setTokens([]);
    }
  };

  return {
    isConnected,
    isConnecting,
    walletAddress,
    tokens,
    isLoadingTokens,
    connect,
    disconnect
  };
}
