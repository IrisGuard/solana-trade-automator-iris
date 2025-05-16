
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { priceService } from '@/services/solana/priceService';

// Define the TokenPriceInfo type to include all necessary properties
export interface TokenPriceInfo {
  price: number;
  change24h: number;
  highPrice24h?: number;
  lowPrice24h?: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated?: Date;
}

export const usePriceSubscription = (tokenAddress: string | null) => {
  const [priceInfo, setPriceInfo] = useState<TokenPriceInfo>({
    price: 0,
    change24h: 0,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!tokenAddress) return;

    let intervalId: ReturnType<typeof setInterval>;
    
    const setupPriceUpdates = async () => {
      // Initial update
      await updatePrice();
      
      // Subscribe to price updates
      intervalId = setInterval(async () => {
        await updatePrice();
      }, 10000); // Update every 10 seconds
      
      setIsSubscribed(true);
    };
    
    const updatePrice = async () => {
      try {
        // Get real price from service
        const priceData = await priceService.getTokenPrice(tokenAddress);
        
        if (priceData && typeof priceData.price === 'number') {
          // Update with valid properties for our TokenPriceInfo type
          setPriceInfo({
            price: priceData.price,
            change24h: priceData.priceChange24h || 0,
            highPrice24h: priceData.price * 1.05, // Estimate high as 5% above current
            lowPrice24h: priceData.price * 0.95, // Estimate low as 5% below current
            volume24h: priceData.volume24h,
            marketCap: priceData.marketCap,
          });
          
          setLastUpdate(new Date());
          setError(null);
        }
      } catch (err) {
        setError(err as Error);
        toast.error('Failed to update token price');
        console.error('Price subscription error:', err);
      }
    };
    
    setupPriceUpdates();
    
    return () => {
      if (intervalId) clearInterval(intervalId);
      setIsSubscribed(false);
    };
  }, [tokenAddress]);
  
  return {
    priceInfo,
    isSubscribed,
    error,
    lastUpdate,
  };
};
