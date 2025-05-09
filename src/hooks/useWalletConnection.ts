
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { walletService, tokensService } from "@/services/database";

export interface Token {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  logo?: string;
}

export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [solBalance, setSolBalance] = useState("0");
  const [tokens, setTokens] = useState<Token[]>([]);
  const { user } = useAuth();

  // Mock tokens data for demonstration
  const mockTokens: Token[] = [
    {
      address: "So11111111111111111111111111111111111111112",
      name: "Solana",
      symbol: "SOL",
      amount: 12.45,
      logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
    },
    {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      name: "USD Coin",
      symbol: "USDC",
      amount: 356.78,
      logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
    },
    {
      address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      name: "USDT",
      symbol: "USDT",
      amount: 120.5,
      logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png"
    }
  ];

  // Check if wallet is connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check if phantom is installed
        const isPhantomInstalled = window.phantom?.solana?.isPhantom;
        
        if (isPhantomInstalled && user) {
          // Load wallet data from Supabase
          const wallets = await walletService.getWalletByUser(user.id);
          if (wallets && wallets.length > 0) {
            setWalletAddress(wallets[0].address);
            setIsConnected(true);
            
            // Load tokens from Supabase
            const userTokens = await tokensService.getTokensByUser(user.id);
            if (userTokens && userTokens.length > 0) {
              const formattedTokens = userTokens.map(token => ({
                address: token.token_address,
                name: token.name,
                symbol: token.symbol,
                amount: token.amount,
                logo: token.logo
              }));
              setTokens(formattedTokens);
            } else {
              // If no tokens in db, use mock data
              setTokens(mockTokens);
              // Save mock tokens to db
              if (user) {
                tokensService.saveTokens(user.id, mockTokens).catch(console.error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, [user]);

  const connectWallet = useCallback(async () => {
    try {
      // Check if Phantom is installed
      if (!window.phantom?.solana?.isPhantom) {
        toast.error("Phantom wallet is not installed. Please install it first.");
        window.open("https://phantom.app/", "_blank");
        return;
      }

      // Connect to wallet
      const resp = await window.phantom.solana.connect();
      setWalletAddress(resp.publicKey.toString());
      setIsConnected(true);
      setSolBalance("12.45"); // Mock balance

      // Set tokens
      setTokens(mockTokens);
      
      toast.success("Wallet connected successfully!");
      
      // Save wallet address to Supabase
      if (user) {
        await walletService.saveWalletAddress(user.id, resp.publicKey.toString());
        await tokensService.saveTokens(user.id, mockTokens);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  }, [user]);

  const disconnectWallet = useCallback(() => {
    if (window.phantom?.solana) {
      window.phantom.solana
        .disconnect()
        .then(() => {
          setIsConnected(false);
          setWalletAddress("");
          setSolBalance("0");
          setTokens([]);
          toast.success("Wallet disconnected successfully!");
        })
        .catch((error) => {
          console.error("Error disconnecting wallet:", error);
          toast.error("Failed to disconnect wallet. Please try again.");
        });
    }
  }, []);

  return {
    isConnected,
    walletAddress,
    solBalance,
    tokens,
    connectWallet,
    disconnectWallet,
  };
}

// Add type definition for window.phantom
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
        disconnect: () => Promise<void>;
      };
    };
  }
}
