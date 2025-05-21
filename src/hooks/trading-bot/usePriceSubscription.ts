
import { useState, useEffect } from '../../react-compatibility';
import { toast } from 'sonner';

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
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (!tokenAddress) return;

    // Simulate price subscription
    let intervalId;
    
    const setupPriceUpdates = () => {
      // Initial update
      updatePrice();
      
      // Subscribe to price updates
      intervalId = setInterval(() => {
        updatePrice();
      }, 10000); // Update every 10 seconds
      
      setIsSubscribed(true);
    };
    
    const updatePrice = () => {
      try {
        // Generate random price changes to simulate real updates
        const basePrice = 100; // Base price for all tokens
        const variance = Math.random() * 10 - 5; // Random variance between -5 and +5
        const newPrice = basePrice + variance;
        const change = ((newPrice - basePrice) / basePrice) * 100;
        
        // Update with valid properties for our TokenPriceInfo type
        setPriceInfo({
          price: newPrice,
          change24h: change,
          highPrice24h: newPrice + (Math.random() * 5),
          lowPrice24h: newPrice - (Math.random() * 5),
          volume24h: 1000000 + (Math.random() * 500000),
          marketCap: 100000000 + (Math.random() * 10000000),
          lastUpdated: new Date(),
        });
        
        setLastUpdate(new Date());
        setError(null);
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
