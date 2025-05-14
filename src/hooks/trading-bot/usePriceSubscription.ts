
import { useState, useCallback, useEffect } from 'react';
import { priceService } from '@/services/solana/price';
import { Token } from '@/types/wallet';
import { TokenPriceInfo } from './types';

export function usePriceSubscription() {
  const [tokenPrice, setTokenPrice] = useState<any>(null);
  const [priceSubscription, setPriceSubscription] = useState<any>(null);
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<TokenPriceInfo | null>(null);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState<Token | undefined>(undefined);

  // Set up token price subscription
  const setupPriceSubscription = useCallback(async (token: string | null, tokenDetails: Token | undefined, tokens: Token[]) => {
    setSelectedTokenDetails(tokenDetails);
    
    if (!token) {
      setSelectedTokenPrice(null);
      return;
    }
    
    try {
      // Clean up existing subscription
      if (priceSubscription) {
        priceService.unsubscribeFromPriceUpdates(priceSubscription);
      }
      
      // Simulate price data for now
      const mockPrice: TokenPriceInfo = {
        price: 25.75,
        priceChange24h: 3.5
      };
      setSelectedTokenPrice(mockPrice);
      
      // Create new price subscription
      const newSubscription = priceService.subscribeToPriceUpdates({
        tokenAddress: token,
        callback: (price) => setTokenPrice(price),
        interval: 30000 // 30 seconds
      });
      
      setPriceSubscription(newSubscription);
    } catch (error) {
      console.error("Error setting up token price tracking:", error);
    }
  }, [priceSubscription]);

  // Cleanup subscription on unmount
  const cleanupSubscription = useCallback(() => {
    if (priceSubscription) {
      priceService.unsubscribeFromPriceUpdates(priceSubscription);
      setPriceSubscription(null);
    }
  }, [priceSubscription]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanupSubscription;
  }, [cleanupSubscription]);

  return {
    tokenPrice,
    priceSubscription,
    selectedTokenPrice,
    selectedTokenDetails,
    setSelectedTokenDetails,
    setupPriceSubscription,
    cleanupSubscription
  };
}
