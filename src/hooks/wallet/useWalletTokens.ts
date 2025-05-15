import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { errorCollector } from '@/utils/error-handling/collector';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import type { Token } from '@/types/wallet';

export function useWalletTokens() {
  const { publicKey } = useWallet();
  const { user } = useAuth();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicKey) {
        setTokens([]);
        return;
      }

      setLoading(true);
      try {
        // Fetch tokens from the database based on user ID and wallet address
        const { data, error } = await supabase
          .from('wallet_tokens')
          .select('*')
          .eq('user_id', user?.id)
          .eq('wallet_address', publicKey.toBase58());

        if (error) {
          throw error;
        }

        if (data && Array.isArray(data)) {
          // Map the database results to the Token interface
          const mappedTokens: Token[] = data.map(item => ({
            address: item.address,
            symbol: item.symbol,
            name: item.name,
            amount: item.amount,
            decimals: item.decimals,
            logo: item.logo,
            mint: item.mint
          }));
          setTokens(mappedTokens);
        } else {
          setTokens([]);
        }
      } catch (err) {
        errorCollector.captureError(err as Error, {
          component: 'useWalletTokens',
          source: 'fetchTokens'
        });
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [publicKey, user]);

  return { tokens, loading, error };
}

