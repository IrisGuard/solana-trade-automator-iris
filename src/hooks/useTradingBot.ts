
import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { priceService } from '@/services/solana/price';
import { tradingService } from '@/services/solana';
import { Token } from '@/types/wallet';

// Define interface for bot configuration
interface TradingBotConfig {
  selectedToken: string | null;
  tradeAmount: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  maxTrades: number;
}

// Define active order interface
interface Order {
  id: string;
  type: 'stop-loss' | 'take-profit' | 'limit-buy' | 'limit-sell';
  price: number;
  amount: number;
  token: string;
  createdAt: Date;
}

export function useTradingBot() {
  const { publicKey, connected } = useWallet();
  const [bots, setBots] = useState<any[]>([]);
  const [activeBot, setActiveBot] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [tokenPrice, setTokenPrice] = useState<any>(null);
  const [priceSubscription, setPriceSubscription] = useState<any>(null);
  const [botStatus, setBotStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState<Token | undefined>(undefined);
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<{ price: number; priceChange24h: number } | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  
  // Bot configuration state
  const [config, setConfig] = useState<TradingBotConfig>({
    selectedToken: null,
    tradeAmount: 0.1,
    stopLossPercent: 5,
    takeProfitPercent: 10,
    maxTrades: 5
  });

  // Update config function to partially update the configuration
  const updateConfig = useCallback((newConfig: Partial<TradingBotConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  }, []);

  // Load available tokens
  useEffect(() => {
    if (connected && publicKey) {
      const loadTokens = async () => {
        try {
          // In a real implementation, this would fetch tokens from a service
          const demoTokens: Token[] = [
            { address: 'sol1', symbol: 'SOL', name: 'Solana', amount: 2.5, decimals: 9 },
            { address: 'ray1', symbol: 'RAY', name: 'Raydium', amount: 100, decimals: 6 },
            { address: 'usdc1', symbol: 'USDC', name: 'USD Coin', amount: 500, decimals: 6 }
          ];
          setTokens(demoTokens);
        } catch (error) {
          console.error("Error loading tokens:", error);
        }
      };
      
      loadTokens();
    }
  }, [connected, publicKey]);

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
  const selectToken = useCallback(async (token: string | null) => {
    setConfig(prev => ({ ...prev, selectedToken: token }));
    
    if (!token) {
      setSelectedTokenDetails(undefined);
      setSelectedTokenPrice(null);
      return;
    }
    
    // Find token details
    const tokenDetails = tokens.find(t => t.address === token);
    setSelectedTokenDetails(tokenDetails);
    
    try {
      // Setup price subscription
      if (priceSubscription) {
        priceService.unsubscribeFromPriceUpdates(priceSubscription);
      }
      
      // Simulate price data for now
      const mockPrice = {
        price: 25.75,
        priceChange24h: 3.5
      };
      setSelectedTokenPrice(mockPrice);
      
      const newSubscription = priceService.subscribeToPriceUpdates({
        tokenAddress: token,
        callback: (price) => setTokenPrice(price),
        interval: 30000 // 30 seconds
      });
      
      setPriceSubscription(newSubscription);
      
    } catch (error) {
      console.error("Error setting up token price tracking:", error);
      toast.error("Αποτυχία παρακολούθησης τιμής token");
    }
  }, [priceSubscription, tokens]);

  // Start the trading bot
  const startBot = useCallback(() => {
    if (!config.selectedToken) {
      toast.error("Επιλέξτε ένα token πρώτα");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would initiate the trading bot
      setTimeout(() => {
        setBotStatus('running');
        
        // Create some mock active orders
        const orders: Order[] = [
          {
            id: '1',
            type: 'stop-loss',
            price: selectedTokenPrice ? selectedTokenPrice.price * 0.95 : 0,
            amount: config.tradeAmount,
            token: config.selectedToken,
            createdAt: new Date()
          },
          {
            id: '2',
            type: 'take-profit',
            price: selectedTokenPrice ? selectedTokenPrice.price * 1.10 : 0,
            amount: config.tradeAmount,
            token: config.selectedToken,
            createdAt: new Date()
          }
        ];
        
        setActiveOrders(orders);
        toast.success("Το bot ξεκίνησε επιτυχώς");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to start bot:", error);
      toast.error("Αποτυχία εκκίνησης bot");
      setIsLoading(false);
    }
  }, [config.selectedToken, config.tradeAmount, selectedTokenPrice]);

  // Stop the trading bot
  const stopBot = useCallback(() => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would stop the trading bot
      setTimeout(() => {
        setBotStatus('idle');
        setActiveOrders([]);
        toast.success("Το bot σταμάτησε επιτυχώς");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to stop bot:", error);
      toast.error("Αποτυχία διακοπής bot");
      setIsLoading(false);
    }
  }, []);

  // Create a new bot
  const createBot = useCallback(async (botConfig: any) => {
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
    
    if (botStatus === 'running') {
      stopBot();
    }
  }, [priceSubscription, botStatus, stopBot]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    bots,
    activeBot,
    isCreating,
    isLoading,
    selectedToken,
    tokenPrice,
    config,
    updateConfig,
    loadBots,
    selectToken,
    setActiveBot,
    createBot,
    startBot,
    stopBot,
    botStatus,
    activeOrders,
    selectedTokenPrice,
    selectedTokenDetails,
    connected,
    tokens,
    cleanup
  };
}

export default useTradingBot;
