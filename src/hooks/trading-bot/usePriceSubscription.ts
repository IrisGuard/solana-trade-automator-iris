
import { useState, useEffect, useCallback } from 'react';
import { useErrorReporting } from '../useErrorReporting';
import { TokenPriceInfo } from './types';

export function usePriceSubscription(tokenAddress: string | null) {
  const [priceData, setPriceData] = useState<TokenPriceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { reportError } = useErrorReporting();
  
  // Fetch initial price data
  const fetchPriceData = useCallback(async () => {
    if (!tokenAddress) {
      setPriceData(null);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call with random data for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPriceData: TokenPriceInfo = {
        price: Math.random() * 100,
        priceChange24h: (Math.random() * 20) - 10,
        volume24h: Math.random() * 1000000,
        lastUpdated: new Date()
      };
      
      setPriceData(mockPriceData);
    } catch (error) {
      setError(error as Error);
      reportError(error as Error, {
        component: 'PriceSubscription',
        source: 'api',
        details: { tokenAddress }
      });
    } finally {
      setIsLoading(false);
    }
  }, [tokenAddress, reportError]);
  
  // Set up price subscription
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (tokenAddress) {
      // Initial fetch
      fetchPriceData();
      
      // Set up polling interval (in a real app, this would be a websocket)
      intervalId = setInterval(fetchPriceData, 60000); // Update every minute
    } else {
      setPriceData(null);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [tokenAddress, fetchPriceData]);
  
  return {
    priceData,
    isLoading,
    error,
    refreshPrice: fetchPriceData
  };
}
