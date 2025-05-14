
import { useState, useEffect } from 'react';
import { priceService } from '@/services/solana/price';

export function usePriceSubscription(tokenAddress: string | null, refreshInterval: number = 10000) {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tokenAddress) {
      setPrice(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Initial fetch
    const fetchPrice = async () => {
      try {
        const priceData = await priceService.fetchTokenPrice(tokenAddress);
        if (priceData) {
          setPrice(priceData.price);
        }
      } catch (error) {
        console.error("Error fetching token price:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrice();
    
    // Setup subscription
    const unsubscribe = priceService.subscribeToPrice(tokenAddress, (newPrice) => {
      setPrice(newPrice);
    });
    
    return () => {
      unsubscribe();
    };
  }, [tokenAddress, refreshInterval]);

  return { price, isLoading };
}
