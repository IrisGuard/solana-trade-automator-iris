
import { useState, useEffect } from 'react';
import { Token } from '@/types/wallet';
import { toast } from 'sonner';
import { getSolBalance } from '@/services/solana/token/balance';

export function useWallet() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);

  // Sample token data for the demo
  useEffect(() => {
    if (isConnected && walletAddress) {
      setTokens([
        {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          name: 'USD Coin',
          symbol: 'USDC',
          amount: 125.45,
          decimals: 6,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        },
        {
          address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          name: 'USDT',
          symbol: 'USDT',
          amount: 75.2,
          decimals: 6,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
        },
        {
          address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
          name: 'Marinade staked SOL',
          symbol: 'mSOL',
          amount: 3.7,
          decimals: 9,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png'
        }
      ]);
      
      setTokenPrices({
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 1,
        'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 1,
        'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 30.45,
      });
    }
  }, [isConnected, walletAddress]);

  // Get SOL balance when wallet is connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchSolBalance();
    }
  }, [isConnected, walletAddress]);

  const fetchSolBalance = async () => {
    if (!walletAddress) return;
    
    try {
      const bal = await getSolBalance(walletAddress);
      setSolBalance(bal);
      setBalance(bal);
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    setIsConnecting(true);
    
    try {
      // This is a mock implementation, in a real app, you would use Phantom or another wallet provider
      const mockAddress = '8YLKoCr7NdU1XgR5MjqXgmT3UNJqj2GrTwmJaWjfAxGz';
      setWalletAddress(mockAddress);
      setIsConnected(true);
      toast.success('Wallet connected successfully');
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setTokens([]);
    setBalance(0);
    setSolBalance(0);
    toast.success('Wallet disconnected');
  };

  const refreshWalletData = async () => {
    setIsLoadingTokens(true);
    try {
      await fetchSolBalance();
      // In a real app, you would refresh token balances here
      
      toast.success('Wallet data updated');
    } catch (error) {
      console.error('Error refreshing wallet data:', error);
      toast.error('Failed to update wallet data');
    } finally {
      setIsLoadingTokens(false);
    }
  };

  const selectTokenForTrading = (token: Token) => {
    // Implement token selection for trading
    toast.success(`Selected ${token.symbol} for trading`);
    return token;
  };

  return {
    isConnected,
    isConnecting,
    walletAddress,
    tokens,
    balance,
    solBalance,
    tokenPrices,
    isLoadingTokens,
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading
  };
}
