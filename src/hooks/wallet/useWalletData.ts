import { useState, useEffect, useCallback } from '../../react-runtime';
import { Token } from '@/types/wallet';
import { TokenPrices } from '@/services/solana/price/types';
import { getWalletTokens } from '@/services/wallet/tokenService';
import { toast } from 'sonner';
import { heliusService } from '@/services/helius/HeliusService';
import { useErrorReporting } from '@/hooks/useErrorReporting';

export function useWalletData() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const { reportError } = useErrorReporting();
  const [lastLoadTime, setLastLoadTime] = useState(0);

  // Load wallet data
  const loadWalletData = useCallback(async (address: string) => {
    // Throttle calls to avoid too many API requests
    const now = Date.now();
    if (now - lastLoadTime < 10000) { // 10 seconds throttle
      console.log('Throttling wallet data load request');
      return;
    }
    
    setIsLoadingTokens(true);
    setLastLoadTime(now);
    
    try {
      console.log('Loading wallet data for address:', address);
      
      // Try to get token balances from Helius
      try {
        console.log('Fetching token balances from Helius...');
        const tokenBalances = await heliusService.getTokenBalances(address);
        
        if (tokenBalances && tokenBalances.length) {
          console.log('Received token balances:', tokenBalances);
          
          // Get metadata for tokens
          const tokenAddresses = tokenBalances.map(t => t.mint);
          const tokenMetadataList = await heliusService.getTokenMetadata(tokenAddresses);
          
          // Create a map for easy lookup
          const tokenMetadataMap = tokenMetadataList.reduce((acc, token) => {
            acc[token.mint] = token;
            return acc;
          }, {} as Record<string, any>);
          
          // Process token data
          const processedTokens = tokenBalances.map(token => {
            const metadata = tokenMetadataMap[token.mint] || {};
            return {
              address: token.mint,
              symbol: metadata.symbol || 'Unknown',
              name: metadata.name || 'Unknown Token',
              amount: token.amount || 0,
              decimals: token.decimals || 9,
              logo: metadata.logoURI || '',
              mint: token.mint
            };
          }).filter(token => token.amount > 0); // Filter out zero-balance tokens
          
          console.log('Processed tokens:', processedTokens);
          setTokens(processedTokens);
          
          // Set mock prices for now - would be replaced with real price API
          const prices: TokenPrices = {};
          processedTokens.forEach(token => {
            prices[token.address] = {
              price: Math.random() * 100,
              priceChange24h: (Math.random() * 20) - 10
            };
          });
          
          setTokenPrices(prices);
        } else {
          console.log('No token balances received or empty array returned');
          toast.info('Δε βρέθηκαν tokens στο πορτοφόλι σας');
          setTokens([]);
        }
      } catch (tokenError) {
        console.error('Error fetching token balances:', tokenError);
        reportError(tokenError as Error);
        toast.error('Αδυναμία φόρτωσης των tokens', {
          description: 'Παρακαλώ δοκιμάστε ξανά αργότερα'
        });
        setTokens([]);
      }
    } catch (err: any) {
      console.error('Loading wallet data error:', err);
      reportError(err);
      toast.error('Σφάλμα φόρτωσης δεδομένων πορτοφολιού');
    } finally {
      setIsLoadingTokens(false);
    }
  }, [reportError, lastLoadTime]);

  // Select token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const selectedToken = tokens.find(t => t.address === tokenAddress);
    
    if (selectedToken) {
      toast.success(`Επιλέχθηκε το ${selectedToken.symbol || selectedToken.name} για συναλλαγές`);
      return selectedToken;
    }
    
    return null;
  }, [tokens]);

  return { tokens, tokenPrices, isLoadingTokens, loadWalletData, selectTokenForTrading };
}
