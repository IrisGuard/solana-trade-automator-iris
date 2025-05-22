
import { useState, useEffect, useCallback } from '../../react-compatibility';
import { toast } from 'sonner';

export function usePriceSubscription(tokenAddress: string | null, isActive: boolean) {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Subscribe to price updates
  const subscribe = useCallback(() => {
    if (!tokenAddress) {
      setError('No token address provided');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Subscribing to price updates for ${tokenAddress}`);
      
      // In a real app, this would connect to a websocket or polling system
      const initialPrice = 10 + Math.random() * 90;
      setCurrentPrice(initialPrice);
      setPriceHistory([{ price: initialPrice, timestamp: Date.now() }]);
      
      setIsSubscribed(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Failed to subscribe to price updates:', err);
      setError('Failed to subscribe to price updates');
      setIsLoading(false);
      toast.error('Failed to subscribe to price updates');
      return false;
    }
  }, [tokenAddress]);
  
  // Unsubscribe from price updates
  const unsubscribe = useCallback(() => {
    console.log(`Unsubscribing from price updates for ${tokenAddress}`);
    setIsSubscribed(false);
    return true;
  }, [tokenAddress]);
  
  // Generate mock price updates when active
  useEffect(() => {
    if (!isActive || !isSubscribed || !tokenAddress) return;
    
    // Mock price update interval
    const interval = setInterval(() => {
      // Generate a small price change (-2% to +2%)
      const changePercent = -2 + Math.random() * 4;
      const currentValue = currentPrice || 100;
      const newPrice = currentValue * (1 + changePercent / 100);
      
      setCurrentPrice(newPrice);
      setPriceHistory(prev => [
        ...prev,
        { price: newPrice, timestamp: Date.now() }
      ].slice(-100)); // Keep only last 100 entries
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentPrice, isActive, isSubscribed, tokenAddress]);
  
  // Subscribe/unsubscribe based on active state
  useEffect(() => {
    if (isActive && tokenAddress && !isSubscribed) {
      subscribe();
    } else if (!isActive && isSubscribed) {
      unsubscribe();
    }
  }, [isActive, isSubscribed, subscribe, tokenAddress, unsubscribe]);
  
  return {
    currentPrice,
    priceHistory,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe
  };
}
