
import { useState, useCallback, useEffect } from 'react';
import { Token } from '@/types/wallet';
import { TokenPriceInfo } from './types';

/**
 * Hook για να διαχειριστεί τις συνδρομές τιμών για tokens
 */
export function usePriceSubscription() {
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<TokenPriceInfo | null>(null);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState<Token | undefined>(undefined);
  const [subscriptionActive, setSubscriptionActive] = useState<boolean>(false);

  // Function to setup price subscription for a token
  const setupPriceSubscription = useCallback(async (tokenAddress: string) => {
    try {
      setIsLoading(true);
      console.log(`Setting up price subscription for token: ${tokenAddress}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create mock price data for the token
      const mockPrice = Math.random() * 1000;
      setPrice(mockPrice);
      
      // Set the selected token price info
      setSelectedTokenPrice({
        currentPrice: mockPrice,
        priceChange24h: (Math.random() * 10) - 5, // -5% to +5%
        highPrice24h: mockPrice * (1 + Math.random() * 0.1),
        lowPrice24h: mockPrice * (1 - Math.random() * 0.1),
        volume24h: Math.random() * 1000000,
        marketCap: Math.random() * 10000000000,
        lastUpdated: new Date()
      });
      
      setSubscriptionActive(true);
      
      // Setup interval to update price periodically
      const interval = setInterval(() => {
        const newPrice = price * (1 + (Math.random() * 0.02) - 0.01); // -1% to +1%
        setPrice(newPrice);
        setSelectedTokenPrice(prev => {
          if (!prev) return null;
          return {
            ...prev,
            currentPrice: newPrice,
            lastUpdated: new Date()
          };
        });
      }, 5000);
      
      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error setting up price subscription:", error);
    } finally {
      setIsLoading(false);
    }
  }, [price]);

  // Cleanup subscription when component unmounts
  const cleanupSubscription = useCallback(() => {
    console.log("Cleaning up price subscription");
    setSubscriptionActive(false);
    setSelectedTokenPrice(null);
  }, []);

  // Return values and functions
  return {
    price,
    isLoading,
    selectedTokenPrice,
    selectedTokenDetails,
    setupPriceSubscription,
    cleanupSubscription
  };
}
