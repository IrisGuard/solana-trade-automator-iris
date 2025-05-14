
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { isPhantomInstalled, connectPhantomWallet, disconnectPhantomWallet, registerPhantomEvents } from '@/utils/phantomWallet';
import { useErrorReporting } from './useErrorReporting';
import { Token } from '@/types/wallet';

export function usePhantomConnection() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { reportError } = useErrorReporting();

  // Function to connect wallet
  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      toast.info("Connecting to Phantom Wallet...");
      
      if (!isPhantomInstalled()) {
        toast.error("Phantom wallet is not installed", {
          description: "Please install Phantom Wallet to connect",
          action: {
            label: "Install",
            onClick: () => window.open("https://phantom.app/", "_blank")
          }
        });
        setError('Phantom wallet is not installed');
        return;
      }
      
      const address = await connectPhantomWallet();
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
        localStorage.setItem('walletConnected', 'true');
        toast.success("Successfully connected to Phantom Wallet");
        await loadWalletData(address);
      }
    } catch (err: any) {
      if (err.message?.includes('user rejected')) {
        toast.error("Connection rejected by user");
      } else {
        toast.error(`Failed to connect wallet: ${err.message || 'Unknown error'}`);
        reportError(new Error(`Wallet connection error: ${err.message}`));
      }
      setError(err.message || 'Unknown error connecting wallet');
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, reportError]);

  // Function to disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await disconnectPhantomWallet();
      setWalletAddress('');
      setIsConnected(false);
      setSolBalance(0);
      setTokens([]);
      localStorage.removeItem('walletConnected');
      toast.success("Wallet disconnected");
    } catch (err: any) {
      toast.error("Failed to disconnect wallet");
      console.error('Error disconnecting wallet:', err);
      reportError(new Error(`Wallet disconnection error: ${err.message}`));
    }
  }, [reportError]);

  // Function to load wallet data
  const loadWalletData = useCallback(async (address: string) => {
    try {
      setIsLoadingTokens(true);
      
      // Fetch SOL balance
      const balanceResponse = await fetch(`https://api.mainnet-beta.solana.com`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address]
        })
      });
      
      const balanceData = await balanceResponse.json();
      const solAmount = balanceData.result?.value ? balanceData.result.value / 1000000000 : 0;
      setSolBalance(solAmount);
      
      // Fetch tokens (mock data for demo)
      const mockTokens: Token[] = [
        {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          name: 'USD Coin',
          symbol: 'USDC',
          amount: 123.45,
          decimals: 6,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        },
        {
          address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
          name: 'Wrapped Bitcoin',
          symbol: 'BTC',
          amount: 0.0012,
          decimals: 8,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png'
        },
        {
          address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
          name: 'Marinade Staked SOL',
          symbol: 'mSOL',
          amount: 2.5,
          decimals: 9,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png'
        }
      ];
      
      setTokens(mockTokens);
      
    } catch (error) {
      console.error("Error loading wallet data:", error);
      toast.error("Failed to load wallet data");
    } finally {
      setIsLoadingTokens(false);
    }
  }, []);

  // Function to refresh wallet data
  const refreshWalletData = useCallback(() => {
    if (!walletAddress) return;
    loadWalletData(walletAddress);
    toast.info("Refreshing wallet data...");
  }, [walletAddress, loadWalletData]);

  // Function to handle token selection for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      toast.success(`Selected ${token.symbol} for trading`);
      return token;
    }
    return null;
  }, [tokens]);

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        if (isPhantomInstalled()) {
          // Check localStorage for previous connection
          const wasConnected = localStorage.getItem('walletConnected') === 'true';
          
          if (wasConnected) {
            try {
              const address = await connectPhantomWallet(true); // Only if trusted
              if (address) {
                setWalletAddress(address);
                setIsConnected(true);
                loadWalletData(address);
              }
            } catch (err) {
              // Expected if not a trusted connection
              console.log("No trusted connection available");
            }
          }
        }
      } catch (err) {
        console.error("Error checking existing connection:", err);
      }
    };
    
    checkExistingConnection();
  }, [loadWalletData]);

  // Set up Phantom event listeners
  useEffect(() => {
    if (!isPhantomInstalled()) return;
    
    const cleanup = registerPhantomEvents(
      (publicKey) => {
        setWalletAddress(publicKey);
        setIsConnected(true);
        loadWalletData(publicKey);
      },
      () => {
        setWalletAddress('');
        setIsConnected(false);
        setSolBalance(0);
        setTokens([]);
      }
    );
    
    return cleanup;
  }, [loadWalletData]);

  return {
    walletAddress,
    isConnected,
    isConnecting,
    solBalance,
    tokens,
    isLoadingTokens,
    error,
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading,
    isPhantomInstalled: isPhantomInstalled()
  };
}
