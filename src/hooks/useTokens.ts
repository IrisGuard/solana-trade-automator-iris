
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Add debouncing and caching
  const cacheRef = useRef<{ [key: string]: { data: Token[], timestamp: number } }>({});
  const timeoutRef = useRef<NodeJS.Timeout>();
  const CACHE_DURATION = 30000; // 30 seconds cache

  const fetchTokens = useCallback(async () => {
    if (!publicKey || !connection || !connected) {
      setTokens([]);
      return;
    }

    const walletKey = publicKey.toString();
    const now = Date.now();
    
    // Check cache first
    if (cacheRef.current[walletKey] && 
        (now - cacheRef.current[walletKey].timestamp) < CACHE_DURATION) {
      setTokens(cacheRef.current[walletKey].data);
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the actual fetch
    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching tokens from Solana blockchain for:', walletKey);
        
        // Get SOL balance first with fallback
        let solAmount = 0;
        try {
          const solBalance = await connection.getBalance(publicKey);
          solAmount = solBalance / 1e9; // Convert lamports to SOL
        } catch (balanceError) {
          console.warn('Failed to fetch SOL balance, using fallback:', balanceError);
          // Continue with 0 SOL balance instead of failing completely
        }
        
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
          let tokenMetadata: any[] = [];
          try {
            const jupiterResponse = await fetch('https://token.jup.ag/strict');
            if (jupiterResponse.ok) {
              tokenMetadata = await jupiterResponse.json();
              console.log(`Fetched metadata for ${tokenMetadata.length} tokens from Jupiter API`);
            }
          } catch (metadataError) {
            console.warn('Failed to fetch token metadata, continuing without:', metadataError);
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
        
        // Cache the results
        cacheRef.current[walletKey] = {
          data: tokenList,
          timestamp: now
        };
        
        setTokens(tokenList);
        
      } catch (err) {
        console.error('Error in fetchTokens:', err);
        setError('Failed to load tokens');
        reportError(err, {
          component: 'useTokens',
          source: 'fetchTokens'
        });
        
        // Set default SOL token if everything fails
        const fallbackTokens = [{
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          amount: 0,
          decimals: 9,
          mint: 'So11111111111111111111111111111111111111112',
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        }];
        
        setTokens(fallbackTokens);
        
        toast.error('Failed to load tokens', {
          description: 'Using fallback data'
        });
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce
  }, [publicKey, connection, connected, reportError]);

  // Auto-fetch tokens when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchTokens();
    } else {
      setTokens([]);
    }
  }, [fetchTokens, connected, publicKey]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    tokens,
    isLoading,
    error,
    refreshTokens: fetchTokens,
  };
}
