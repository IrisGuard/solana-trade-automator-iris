
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect, useCallback } from 'react';
import { Token } from '@/types/wallet';

export function useTokens() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    if (!publicKey || !connection || !connected) {
      setTokens([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock tokens for demo - in production this would fetch real tokens
      const mockTokens: Token[] = [
        {
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          amount: 2.5,
          decimals: 9,
          mint: 'So11111111111111111111111111111111111111112',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        },
        {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          symbol: 'USDC',
          name: 'USD Coin',
          amount: 100,
          decimals: 6,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        }
      ];
      
      setTokens(mockTokens);
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Σφάλμα κατά τη λήψη των tokens');
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, connected]);

  // Auto-fetch tokens when wallet connects
  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return {
    tokens,
    isLoading,
    error,
    refreshTokens: fetchTokens,
  };
}
