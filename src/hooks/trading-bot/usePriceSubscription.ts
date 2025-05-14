
import { useState, useEffect, useCallback } from 'react';
import { Token } from '@/types/wallet';
import { toast } from 'sonner';

export interface PriceSubscriptionHook {
  price: number;
  isLoading: boolean;
  tokenPrice: number; // Προσθήκη για συμβατότητα
  selectedTokenPrice: number; // Προσθήκη για συμβατότητα
  selectedTokenDetails: Token | null; // Προσθήκη για συμβατότητα
  setupPriceSubscription: (token: Token) => void;
  cleanupSubscription: () => void;
}

export function usePriceSubscription(): PriceSubscriptionHook {
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Συνάρτηση για προσομοίωση τιμών με μικρές διακυμάνσεις
  const simulatePriceUpdate = useCallback((basePrice: number): number => {
    const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% διακύμανση
    return basePrice * (1 + fluctuation);
  }, []);

  // Εγκατάσταση της συνδρομής για συγκεκριμένο token
  const setupPriceSubscription = useCallback((token: Token) => {
    // Καθαρισμός προηγούμενων συνδρομών
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    setIsLoading(true);
    setSelectedToken(token);
    
    // Προσομοίωση αρχικής τιμής βασισμένη στο token
    const initialPrice = token.amount > 0 ? (token.amount * Math.random() * 5) + 1 : Math.random() * 10 + 1;
    setPrice(initialPrice);
    
    // Δημιουργία νέας συνδρομής για ενημερώσεις τιμών
    const id = setInterval(() => {
      setPrice(prevPrice => simulatePriceUpdate(prevPrice));
    }, 5000) as unknown as number;
    
    setIntervalId(id);
    setIsLoading(false);
    
    toast.success(`Ενεργοποιήθηκε παρακολούθηση τιμής για το ${token.symbol}`, {
      position: "bottom-right",
      duration: 3000
    });
    
    return () => {
      if (id) clearInterval(id);
    };
  }, [simulatePriceUpdate]);

  // Καθαρισμός συνδρομής
  const cleanupSubscription = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      
      if (selectedToken) {
        toast.info(`Τερματίστηκε η παρακολούθηση τιμής για το ${selectedToken.symbol}`, {
          position: "bottom-right",
          duration: 3000
        });
      }
      
      setSelectedToken(null);
    }
  }, [intervalId, selectedToken]);

  // Καθαρισμός κατά την αποφόρτωση
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return {
    price,
    isLoading,
    tokenPrice: price,
    selectedTokenPrice: price,
    selectedTokenDetails: selectedToken,
    setupPriceSubscription,
    cleanupSubscription
  };
}
