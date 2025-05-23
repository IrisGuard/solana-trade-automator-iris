
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect, useCallback } from 'react';
import { Token } from '@/types/wallet';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { toast } from 'sonner';
import { useErrorReporting } from '@/hooks/useErrorReporting';

// Export Token for other components to use
export type { Token };

export function useTokens() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { reportError } = useErrorReporting();

  const fetchTokens = useCallback(async () => {
    if (!publicKey || !connection || !connected) {
      setTokens([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching tokens from Solana blockchain for:', publicKey.toString());
      
      // Get SOL balance first
      const solBalance = await connection.getBalance(publicKey);
      const solAmount = solBalance / 1e9; // Convert lamports to SOL
      
      // Initialize token list with SOL
      const tokenList: Token[] = [{
        address: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        amount: solAmount,
        decimals: 9,
        mint: 'So11111111111111111111111111111111111111112',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
      }];
      
      try {
        // Get all token accounts for the wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID },
          'confirmed'
        );

        console.log(`Found ${tokenAccounts.value.length} token accounts`);
        
        // Fetch token metadata from Jupiter API for better info
        const jupiterResponse = await fetch('https://token.jup.ag/strict');
        let tokenMetadata: any[] = [];
        
        if (jupiterResponse.ok) {
          tokenMetadata = await jupiterResponse.json();
          console.log(`Fetched metadata for ${tokenMetadata.length} tokens from Jupiter API`);
        }
        
        // Process token accounts
        for (const account of tokenAccounts.value) {
          const parsedInfo = account.account.data.parsed.info;
          const mintAddress = parsedInfo.mint;
          const tokenAmount = parsedInfo.tokenAmount;
          
          // Only include tokens with non-zero balances
          if (tokenAmount && tokenAmount.uiAmount && tokenAmount.uiAmount > 0) {
            console.log(`Token found: ${mintAddress}, amount: ${tokenAmount.uiAmount}`);
            
            // Try to find token metadata
            const metadata = tokenMetadata.find((t: any) => t.address === mintAddress);
            
            tokenList.push({
              address: mintAddress,
              symbol: metadata?.symbol || 'Unknown',
              name: metadata?.name || 'Unknown Token',
              amount: tokenAmount.uiAmount,
              decimals: tokenAmount.decimals,
              mint: mintAddress,
              logo: metadata?.logoURI || ''
            });
          }
        }
        
      } catch (tokenError) {
        console.error('Error fetching token accounts:', tokenError);
        reportError(tokenError, {
          component: 'useTokens',
          source: 'fetchTokenAccounts'
        });
        
        // Continue with SOL only if token fetching fails
        console.log('Continuing with SOL balance only');
      }
      
      console.log(`Total tokens found with balances: ${tokenList.length}`);
      setTokens(tokenList);
      
    } catch (err) {
      console.error('Error in fetchTokens:', err);
      setError('Failed to load tokens');
      reportError(err, {
        component: 'useTokens',
        source: 'fetchTokens'
      });
      
      // Set default SOL token if everything fails
      setTokens([{
        address: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        amount: 0,
        decimals: 9,
        mint: 'So11111111111111111111111111111111111111112',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
      }]);
      
      toast.error('Failed to load tokens', {
        description: 'Using fallback data'
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, connected, reportError]);

  // Auto-fetch tokens when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchTokens();
    } else {
      setTokens([]);
    }
  }, [fetchTokens, connected, publicKey]);

  return {
    tokens,
    isLoading,
    error,
    refreshTokens: fetchTokens,
  };
}
