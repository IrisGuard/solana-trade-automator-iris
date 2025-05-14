
import { useState, useEffect } from 'react';
import { TokenPriceInfo } from './types';

export function usePriceSubscription(tokenAddress: string | null) {
  const [priceInfo, setPriceInfo] = useState<TokenPriceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!tokenAddress) {
      setPriceInfo(null);
      return;
    }
    
    setIsLoading(true);
    
    // This would be replaced with an actual API call in a real application
    const fetchPrice = async () => {
      try {
        // Mock price data
        const mockPrice: TokenPriceInfo = {
          price: Math.random() * 100,
          priceChange24h: (Math.random() * 10) - 5,
          volume24h: Math.random() * 1000000,
          marketCap: Math.random() * 10000000,
          lastUpdated: new Date()
        };
        
        setPriceInfo(mockPrice);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error fetching price'));
        setPriceInfo(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrice();
    
    // Set up interval for price updates
    const intervalId = setInterval(fetchPrice, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [tokenAddress]);
  
  return { priceInfo, isLoading, error };
}
