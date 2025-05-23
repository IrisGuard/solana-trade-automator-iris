
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect, useCallback } from 'react';
import { Token } from '@/types/wallet';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { toast } from 'sonner';

// Export Token for other components to use
export type { Token };

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
      console.log('Φόρτωση tokens από το Solana blockchain (mainnet)...');
      
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

      console.log(`Βρέθηκαν ${tokenAccounts.value.length} token accounts`);
      console.log(`SOL Balance: ${solAmount}`);

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
          console.log(`Token βρέθηκε: ${mintAddress}, ποσότητα: ${tokenAmount.uiAmount}`);
          
          // Try to get token metadata from Jupiter API
          try {
            const response = await fetch(`https://token.jup.ag/strict`);
            if (response.ok) {
              const tokenList = await response.json();
              const tokenInfo = tokenList.find((t: any) => t.address === mintAddress);
              
              if (tokenInfo) {
                tokenList.push({
                  address: mintAddress,
                  symbol: tokenInfo.symbol || 'Unknown',
                  name: tokenInfo.name || 'Unknown Token',
                  amount: tokenAmount.uiAmount,
                  decimals: tokenAmount.decimals,
                  mint: mintAddress,
                  logo: tokenInfo.logoURI || ''
                });
              } else {
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
          } catch (metaError) {
            console.warn('Αποτυχία λήψης metadata για token:', mintAddress);
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
      
      console.log(`Συνολικά βρέθηκαν ${tokenList.length} tokens με υπόλοιπα`);
      setTokens(tokenList);
      
      if (tokenList.length > 0) {
        toast.success(`Βρέθηκαν ${tokenList.length} tokens στο πορτοφόλι σας`);
      } else {
        toast.info('Δεν βρέθηκαν tokens στο πορτοφόλι σας');
      }
      
    } catch (err) {
      console.error('Σφάλμα κατά τη λήψη tokens:', err);
      setError('Σφάλμα κατά τη λήψη των tokens από το blockchain');
      toast.error('Σφάλμα φόρτωσης tokens', {
        description: 'Παρακαλώ δοκιμάστε ξανά'
      });
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
