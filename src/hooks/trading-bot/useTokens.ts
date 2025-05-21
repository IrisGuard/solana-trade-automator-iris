
import { useEffect, useState, useCallback } from '../../react-compatibility';
import { useWallet } from '@solana/wallet-adapter-react';
import { Token } from '@/types/wallet';

export function useTokens() {
  const { publicKey, connected } = useWallet();
  const [tokens, setTokens] = useState([]);
  
  // Load available tokens
  useEffect(() => {
    if (connected && publicKey) {
      const loadTokens = async () => {
        try {
          // In a real implementation, this would fetch tokens from a service
          const demoTokens: Token[] = [
            { address: 'sol1', symbol: 'SOL', name: 'Solana', amount: 2.5, decimals: 9, mint: 'sol1' },
            { address: 'ray1', symbol: 'RAY', name: 'Raydium', amount: 100, decimals: 6, mint: 'ray1' },
            { address: 'usdc1', symbol: 'USDC', name: 'USD Coin', amount: 500, decimals: 6, mint: 'usdc1' }
          ];
          setTokens(demoTokens);
        } catch (error) {
          console.error("Error loading tokens:", error);
        }
      };
      
      loadTokens();
    }
  }, [connected, publicKey]);

  // Find token details
  const findTokenDetails = useCallback((tokenAddress: string | null): Token | undefined => {
    if (!tokenAddress) return undefined;
    return tokens.find(t => t.address === tokenAddress);
  }, [tokens]);

  return {
    tokens,
    findTokenDetails
  };
}
