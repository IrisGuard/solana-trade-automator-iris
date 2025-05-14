
import { useCallback, useEffect, useState } from 'react';
import { Token } from '@/types/wallet';

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  // Load mock tokens for demonstration
  useEffect(() => {
    const loadTokens = async () => {
      setLoading(true);
      try {
        // In a real application, we would fetch tokens from an API
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        const mockTokens: Token[] = [
          {
            address: 'So11111111111111111111111111111111111111112',
            name: 'Solana',
            symbol: 'SOL',
            amount: 1.5,
            decimals: 9
          },
          {
            address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            name: 'USD Coin',
            symbol: 'USDC',
            amount: 100,
            decimals: 6
          },
          {
            address: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj',
            name: 'Wrapped Bitcoin',
            symbol: 'BTC',
            amount: 0.01,
            decimals: 8
          }
        ];
        
        setTokens(mockTokens);
      } catch (error) {
        console.error('Failed to load tokens:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTokens();
  }, []);

  const findTokenDetails = useCallback((tokenAddress: string): Token | undefined => {
    return tokens.find(token => token.address === tokenAddress);
  }, [tokens]);

  return { tokens, loading, findTokenDetails };
}
