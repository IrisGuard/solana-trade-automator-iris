
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect, useCallback } from 'react';
import { TokenAccountsFilter } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface Token {
  mint: string;
  amount: number;
  decimals: number;
  symbol?: string;
  name?: string;
  logoURI?: string;
}

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
      // Get all token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const tokenList: Token[] = [];

      for (const account of tokenAccounts.value) {
        const parsedInfo = account.account.data.parsed.info;
        const mintAddress = parsedInfo.mint;
        const amount = parsedInfo.tokenAmount.uiAmount || 0;
        const decimals = parsedInfo.tokenAmount.decimals;

        // Only include tokens with balance > 0
        if (amount > 0) {
          // Try to fetch token metadata (simplified version)
          // In production, you'd use a service like Helius or Jupiter API
          tokenList.push({
            mint: mintAddress,
            amount,
            decimals,
            symbol: `${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
            name: 'Unknown Token',
          });
        }
      }

      setTokens(tokenList);
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
