
import { useState, useCallback, useEffect } from 'react';
import { TokenPriceData } from '@/services/solana/price/types';
import { Token } from '@/types/wallet';

export function usePriceSubscription() {
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<TokenPriceData | null>(null);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState<Token | null>(null);
  
  // Setup price subscription for a token
  const setupPriceSubscription = useCallback(async (
    tokenAddress: string | null, 
    tokenDetails: Token | null,
    tokens: Token[]
  ) => {
    if (!tokenAddress) {
      setSelectedTokenPrice(null);
      setSelectedTokenDetails(null);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demo purposes, create mock price data
      const mockPriceData: TokenPriceData = {
        price: Math.random() * 100,
        priceChange24h: (Math.random() * 20) - 10,
        volume24h: Math.random() * 10000000,
        marketCap: Math.random() * 1000000000,
        lastUpdated: new Date()
      };
      
      setSelectedTokenPrice(mockPriceData);
      setSelectedTokenDetails(tokenDetails);
      setPrice(mockPriceData.price);
    } catch (error) {
      console.error('Error setting up price subscription:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Cleanup subscription
  const cleanupSubscription = useCallback(() => {
    setSelectedTokenPrice(null);
    setSelectedTokenDetails(null);
  }, []);
  
  // Simulate price updates
  useEffect(() => {
    if (!selectedTokenPrice) return;
    
    const interval = setInterval(() => {
      const previousPrice = selectedTokenPrice.price;
      const priceChange = (Math.random() * 2 - 1) * (previousPrice * 0.01);
      const newPrice = Math.max(0.01, previousPrice + priceChange);
      
      setSelectedTokenPrice(prev => prev ? {
        ...prev,
        price: newPrice,
        priceChange24h: prev.priceChange24h + (Math.random() * 0.2 - 0.1),
        lastUpdated: new Date()
      } : null);
      
      setPrice(newPrice);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedTokenPrice]);
  
  return {
    price,
    isLoading,
    tokenPrice: price,
    selectedTokenPrice,
    selectedTokenDetails,
    setupPriceSubscription,
    cleanupSubscription
  };
}
