
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { isPhantomInstalled } from '@/utils/phantomWallet';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { useUser } from '@/hooks/useUser';
import { saveWalletToLocalStorage, saveWalletToSupabase, removeWalletFromStorage, getWalletFromLocalStorage } from '@/utils/walletStorage';
import { heliusService } from '@/services/helius/HeliusService';
import { Token, TokenPrices } from '@/types/wallet';

export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  
  const { reportError } = useErrorReporting();
  const { user } = useUser();
  
  // Check if phantom is installed
  const phantomInstalled = isPhantomInstalled();
  
  // Try to reconnect on component mount
  useEffect(() => {
    const attemptReconnect = async () => {
      // Check for stored wallet
      const storedWallet = getWalletFromLocalStorage();
      
      if (storedWallet && phantomInstalled) {
        try {
          await connectToWallet(storedWallet.address);
        } catch (err) {
          console.error('Auto-reconnect failed:', err);
          // Clear stored wallet if reconnection fails
          removeWalletFromStorage(storedWallet.address, user?.id);
        }
      }
    };
    
    if (!isConnected && !isConnecting) {
      attemptReconnect();
    }
  }, [phantomInstalled, user]);
  
  // Connect to wallet
  const connectWallet = useCallback(async () => {
    if (!phantomInstalled) {
      toast.error("Το Phantom wallet δεν είναι εγκατεστημένο.", {
        description: "Εγκαταστήστε το Phantom wallet για να συνδεθείτε.",
        action: {
          label: "Εγκατάσταση",
          onClick: () => window.open("https://phantom.app/", "_blank")
        }
      });
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // @ts-ignore
      const { solana } = window;
      
      const response = await solana.connect();
      const address = response.publicKey.toString();
      
      console.log('Connected to wallet:', address);
      
      await connectToWallet(address);
      
      // Save wallet to storage
      saveWalletToLocalStorage(address);
      if (user?.id) {
        await saveWalletToSupabase(address, user.id);
      }
      
      toast.success("Το wallet συνδέθηκε επιτυχώς!");
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Σφάλμα σύνδεσης wallet');
      reportError(err);
      toast.error("Σφάλμα σύνδεσης με το wallet", {
        description: err.message
      });
    } finally {
      setIsConnecting(false);
    }
  }, [phantomInstalled, user?.id, reportError]);
  
  // Connect to a specific wallet address
  const connectToWallet = useCallback(async (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    
    // Fetch balances and tokens
    await refreshWalletData(address);
  }, []);
  
  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      // @ts-ignore
      const { solana } = window;
      
      if (solana && solana.disconnect) {
        await solana.disconnect();
      }
      
      // Remove from storage
      if (walletAddress) {
        await removeWalletFromStorage(walletAddress, user?.id);
      }
      
      // Reset state
      setIsConnected(false);
      setWalletAddress(null);
      setSolBalance(0);
      setTokens([]);
      
      toast.info("Το wallet αποσυνδέθηκε");
    } catch (err: any) {
      console.error('Wallet disconnection error:', err);
      reportError(err);
    }
  }, [walletAddress, user?.id, reportError]);
  
  // Refresh wallet data
  const refreshWalletData = useCallback(async (address?: string) => {
    const walletToUse = address || walletAddress;
    
    if (!walletToUse) {
      return;
    }
    
    setIsLoadingTokens(true);
    
    try {
      // Fetch SOL balance
      // @ts-ignore
      const { solana } = window;
      
      if (solana) {
        try {
          // This would normally use the Solana web3.js library
          // For now, simulate with a random balance
          setSolBalance(Math.random() * 10);
          
          // Try to get token balances from Helius
          const tokenBalances = await heliusService.getTokenBalances(walletToUse);
          
          if (tokenBalances && tokenBalances.length) {
            // Process token data
            const processedTokens = tokenBalances.map(token => ({
              address: token.mint,
              symbol: token.symbol || 'Unknown',
              name: token.name || 'Unknown Token',
              amount: token.amount || 0,
              decimals: token.decimals || 9,
              logo: token.logoURI || ''
            }));
            
            setTokens(processedTokens);
            
            // Set mock prices for now
            const mockPrices: TokenPrices = {};
            processedTokens.forEach(token => {
              mockPrices[token.address] = {
                price: Math.random() * 100,
                priceChange24h: (Math.random() * 20) - 10,
                lastUpdated: new Date()
              };
            });
            
            setTokenPrices(mockPrices);
          }
        } catch (err) {
          console.error('Error fetching wallet data:', err);
        }
      }
    } catch (err: any) {
      console.error('Error refreshing wallet data:', err);
      reportError(err);
    } finally {
      setIsLoadingTokens(false);
    }
  }, [walletAddress, reportError]);
  
  // Select token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const selectedToken = tokens.find(t => t.address === tokenAddress);
    
    if (selectedToken) {
      toast.success(`Επιλέχθηκε το ${selectedToken.symbol || selectedToken.name} για συναλλαγές`);
      
      // Simulate navigation to trading page
      // window.location.href = `/trading?token=${tokenAddress}`;
      // For now, just return the selected token
      return selectedToken;
    }
    
    return null;
  }, [tokens]);
  
  return {
    isConnected,
    isConnecting,
    error,
    walletAddress,
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    isPhantomInstalled: phantomInstalled,
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading
  };
}
