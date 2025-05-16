
import { useWalletConnect } from '@/providers/WalletConnectProvider';
import { useState, useEffect } from 'react';
import { Token } from '@/types/wallet';

export const usePhantomConnection = () => {
  const { isConnected, isConnecting, walletAddress, connectWallet, disconnectWallet } = useWalletConnect();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  
  // Fetch tokens when wallet is connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      setIsLoadingTokens(true);
      
      // Simulate fetching tokens - in a real app, this would call a service
      setTimeout(() => {
        const demoTokens: Token[] = [
          { address: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', amount: 12.85, decimals: 9 },
          { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', amount: 580.50, decimals: 6 },
          { address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', symbol: 'RAY', name: 'Raydium', amount: 250, decimals: 6 },
          { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', symbol: 'BONK', name: 'Bonk', amount: 15000000, decimals: 5 },
        ];
        setTokens(demoTokens);
        setIsLoadingTokens(false);
      }, 1500);
    } else {
      // Reset tokens when wallet is disconnected
      setTokens([]);
    }
  }, [isConnected, walletAddress]);
  
  return {
    isConnected,
    isConnecting,
    walletAddress,
    connectWallet,
    disconnectWallet,
    tokens,
    isLoadingTokens
  };
};
