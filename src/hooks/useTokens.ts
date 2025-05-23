
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect, useCallback } from 'react';
import { Token } from '@/types/wallet';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

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
      console.log('Fetching real tokens from Solana blockchain...');
      
      // Get all token accounts for the wallet
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

      // Get SOL balance
      const solBalance = await connection.getBalance(publicKey);
      const solAmount = solBalance / 1e9; // Convert lamports to SOL

      // Process token accounts
      const tokenList: Token[] = [];

      // Add SOL as the first token if balance > 0
      if (solAmount > 0) {
        tokenList.push({
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          amount: solAmount,
          decimals: 9,
          mint: 'So11111111111111111111111111111111111111112',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        });
      }

      // Process SPL tokens
      for (const accountInfo of tokenAccounts.value) {
        const mintAddress = accountInfo.account.data.parsed.info.mint;
        const tokenAmount = accountInfo.account.data.parsed.info.tokenAmount;
        
        if (tokenAmount.uiAmount && tokenAmount.uiAmount > 0) {
          // Try to get token metadata
          try {
            const metadataResponse = await fetch(`https://api.solana.fm/v1/tokens/${mintAddress}`);
            let metadata = null;
            if (metadataResponse.ok) {
              metadata = await metadataResponse.json();
            }

            tokenList.push({
              address: mintAddress,
              symbol: metadata?.symbol || 'Unknown',
              name: metadata?.name || 'Unknown Token',
              amount: tokenAmount.uiAmount,
              decimals: tokenAmount.decimals,
              mint: mintAddress,
              logo: metadata?.logoURI || ''
            });
          } catch (metaError) {
            console.warn('Failed to fetch metadata for token:', mintAddress);
            // Add token without metadata
            tokenList.push({
              address: mintAddress,
              symbol: 'Unknown',
              name: 'Unknown Token',
              amount: tokenAmount.uiAmount,
              decimals: tokenAmount.decimals,
              mint: mintAddress,
              logo: ''
            });
          }
        }
      }
      
      console.log(`Found ${tokenList.length} tokens with balances`);
      setTokens(tokenList);
      
    } catch (err) {
      console.error('Error fetching real tokens:', err);
      setError('Σφάλμα κατά τη λήψη των tokens από το blockchain');
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, connected]);

  // Auto-fetch tokens when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchTokens();
    }
  }, [fetchTokens, connected, publicKey]);

  return {
    tokens,
    isLoading,
    error,
    refreshTokens: fetchTokens,
  };
}
