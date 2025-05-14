
import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { priceService } from '@/services/solana/price';
import { tradingService } from '@/services/solana';

export function useTradingBot() {
  const { publicKey, connected } = useWallet();
  const [bots, setBots] = useState([]);
  const [activeBot, setActiveBot] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [priceSubscription, setPriceSubscription] = useState(null);

  // Load user's bots
  const loadBots = useCallback(async () => {
    if (!connected || !publicKey) return;
    
    setIsLoading(true);
    try {
      const userBots = await tradingService.getUserBots(publicKey.toString());
      setBots(userBots);
    } catch (error) {
      console.error("Failed to load bots:", error);
      toast.error("Αποτυχία φόρτωσης των bots");
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey]);

  // Select token for trading
  const selectToken = useCallback(async (token) => {
    setSelectedToken(token);
    
    try {
      // Setup price subscription
      if (priceSubscription) {
        priceService.unsubscribeFromPriceUpdates(priceSubscription);
      }
      
      const newSubscription = priceService.subscribeToPriceUpdates({
        tokenAddress: token.address,
        callback: (price) => setTokenPrice(price),
        interval: 30000 // 30 seconds
      });
      
      setPriceSubscription(newSubscription);
      
      // Get initial price
      const price = await priceService.getTokenPrice(token.address);
      setTokenPrice(price);
      
    } catch (error) {
      console.error("Error setting up token price tracking:", error);
      toast.error("Αποτυχία παρακολούθησης τιμής token");
    }
  }, [priceSubscription]);

  // Create a new bot
  const createBot = useCallback(async (botConfig) => {
    if (!connected || !publicKey) {
      toast.error("Πρέπει να συνδέσετε το wallet σας");
      return null;
    }
    
    setIsCreating(true);
    try {
      const newBot = await tradingService.createBot({
        ...botConfig,
        userAddress: publicKey.toString()
      });
      
      setBots(prev => [...prev, newBot]);
      toast.success("Το bot δημιουργήθηκε με επιτυχία");
      return newBot;
    } catch (error) {
      console.error("Failed to create bot:", error);
      toast.error("Αποτυχία δημιουργίας bot");
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [connected, publicKey]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (priceSubscription) {
      priceService.unsubscribeFromPriceUpdates(priceSubscription);
      setPriceSubscription(null);
    }
  }, [priceSubscription]);

  return {
    bots,
    activeBot,
    isCreating,
    isLoading,
    selectedToken,
    tokenPrice,
    loadBots,
    selectToken,
    setActiveBot,
    createBot,
    cleanup
  };
}

export default useTradingBot;
