
import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Token } from '@/types/wallet';
import { priceService } from '@/services/solana/priceService';
import { TokenPriceData } from '@/services/solana/priceService';

export function useTokens() {
  const { publicKey, connected } = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, TokenPriceData>>({});
  
  // Load available tokens
  useEffect(() => {
    if (connected && publicKey) {
      const loadTokens = async () => {
        try {
          // In a real implementation, this would fetch tokens from a service
          const demoTokens: Token[] = [
            { address: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', amount: 2.5, decimals: 9 },
            { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', amount: 500, decimals: 6 },
            { address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', symbol: 'RAY', name: 'Raydium', amount: 100, decimals: 6 }
          ];
          setTokens(demoTokens);
          
          // Fetch prices for the tokens
          await loadTokenPrices(demoTokens.map(t => t.address));
        } catch (error) {
          console.error("Error loading tokens:", error);
        }
      };
      
      loadTokens();
    }
  }, [connected, publicKey]);

  // Load token prices
  const loadTokenPrices = async (addresses: string[]) => {
    try {
      const prices = await priceService.fetchTokenPrices(addresses);
      setTokenPrices(prices);
    } catch (error) {
      console.error("Error fetching token prices:", error);
    }
  };

  // Find token details
  const findTokenDetails = useCallback((tokenAddress: string | null): Token | undefined => {
    if (!tokenAddress) return undefined;
    return tokens.find(t => t.address === tokenAddress);
  }, [tokens]);

  // Get price for a specific token
  const getTokenPrice = useCallback((tokenAddress: string | null): TokenPriceData | undefined => {
    if (!tokenAddress) return undefined;
    return tokenPrices[tokenAddress];
  }, [tokenPrices]);

  return {
    tokens,
    tokenPrices,
    findTokenDetails,
    getTokenPrice,
    loadTokenPrices
  };
}
