
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';
import { fetchTokenBalance } from '@/services/solana/token';
import { dbClient } from '@/integrations/supabase/client';
import { useErrorReporting } from '@/hooks/useErrorReporting';

export function useWalletTokens(walletAddress: string | null) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { reportError } = useErrorReporting();

  // Function to fetch tokens for the wallet
  const fetchTokens = useCallback(async () => {
    if (!walletAddress) {
      setTokens([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First try to get tokens from Supabase if the user is authenticated
      const { data: supabaseTokens, error } = await dbClient
        .from('tokens')
        .select('*')
        .eq('token_address', walletAddress);
      
      if (!error && supabaseTokens && supabaseTokens.length > 0) {
        // Map Supabase tokens to Token interface
        const mappedTokens: Token[] = supabaseTokens.map(token => ({
          address: token.token_address,
          name: token.name,
          symbol: token.symbol,
          amount: Number(token.amount),
          decimals: 9, // Default decimals if not specified
          logo: token.logo || undefined
        }));
        
        setTokens(mappedTokens);
        return;
      }
      
      // If no tokens in Supabase or error, fall back to mock data
      const mockTokens: Token[] = [
        {
          address: 'So11111111111111111111111111111111111111112',
          name: 'Solana',
          symbol: 'SOL',
          amount: 1.23,
          decimals: 9
        },
        {
          address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
          name: 'Wrapped Bitcoin',
          symbol: 'BTC',
          amount: 0.001,
          decimals: 8
        },
        {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          name: 'USD Coin',
          symbol: 'USDC',
          amount: 100,
          decimals: 6
        }
      ];
      
      setTokens(mockTokens);
      
      // Try to save mock tokens to Supabase for future use
      try {
        await dbClient
          .from('tokens')
          .upsert(mockTokens.map(token => ({
            user_id: '00000000-0000-0000-0000-000000000000', // Use a default user ID when auth is not available
            token_address: token.address,
            name: token.name,
            symbol: token.symbol,
            amount: token.amount,
            logo: token.logo || null
          })));
      } catch (saveError) {
        console.log('Could not save tokens to Supabase:', saveError);
      }
      
    } catch (err) {
      console.error('Failed to fetch tokens:', err);
      setError('Failed to load tokens. Please try again later.');
      toast.error('Failed to load tokens');
      reportError(err instanceof Error ? err : new Error('Unknown error fetching tokens'), {
        component: 'useWalletTokens',
        source: 'client'
      });
    } finally {
      setLoading(false);
    }
  }, [walletAddress, reportError]);

  // Fetch tokens when wallet address changes
  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return {
    tokens,
    loading,
    error,
    refetch: fetchTokens
  };
}
