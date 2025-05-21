
import { useState, useCallback } from '../../react-compatibility';
import { toast } from 'sonner';
import { Bot, ActiveOrder, TradingBotConfig, TokenPriceInfo } from './types';

/**
 * Hook για τη διαχείριση των ενεργειών του trading bot
 */
export function useBotActions() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [activeBot, setActiveBot] = useState<Bot | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [botStatus, setBotStatus] = useState<'running' | 'idle' | 'paused'>('idle');
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  
  // Φορτώνει τα διαθέσιμα bots
  const loadBots = useCallback(async (): Promise<Bot[]> => {
    setIsLoading(true);
    try {
      // Σε πραγματική εφαρμογή θα φορτώναμε από API
      const mockBots: Bot[] = [
        {
          id: '1',
          name: 'SOL Bot',
          status: 'idle',
          token: 'So11111111111111111111111111111111111111112',
          strategy: 'simple',
          profitLoss: 25.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'USDC Bot',
          status: 'idle',
          token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          strategy: 'advanced',
          profitLoss: -5.2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setBots(mockBots);
      return mockBots;
    } catch (error) {
      console.error("Error loading bots:", error);
      toast.error("Σφάλμα κατά τη φόρτωση των bots");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Δημιουργεί ένα νέο bot
  const createBot = useCallback(async (config: TradingBotConfig): Promise<Bot | null> => {
    setIsCreating(true);
    try {
      // Σε πραγματική εφαρμογή θα αποθηκεύαμε στο API
      const newBot: Bot = {
        id: `bot-${Date.now()}`,
        name: `${config.selectedToken?.substring(0, 4) || 'New'} Bot`,
        status: 'idle',
        token: config.selectedToken || '',
        strategy: config.strategy,
        profitLoss: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setBots(prev => [...prev, newBot]);
      setActiveBot(newBot);
      toast.success("Το bot δημιουργήθηκε επιτυχώς");
      return newBot;
    } catch (error) {
      console.error("Error creating bot:", error);
      toast.error("Σφάλμα κατά τη δημιουργία του bot");
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Ξεκινά το bot
  const startBot = useCallback((config: TradingBotConfig, tokenPrice: TokenPriceInfo | null) => {
    if (!config.selectedToken) {
      toast.error("Παρακαλώ επιλέξτε ένα token πρώτα");
      return;
    }
    
    setIsLoading(true);
    try {
      // Σε πραγματική εφαρμογή θα στέλναμε εντολή στο API
      console.log("Starting bot with config:", config);
      console.log("Current token price:", tokenPrice);
      
      // Δημιουργία υποθετικών εντολών
      const mockOrders: ActiveOrder[] = [
        {
          id: `order-${Date.now()}-1`,
          type: 'buy',
          token: config.selectedToken,
          amount: 0.5,
          price: tokenPrice?.currentPrice || 0,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: `order-${Date.now()}-2`,
          type: 'stop-loss',
          token: config.selectedToken,
          amount: 0.5,
          price: (tokenPrice?.currentPrice || 0) * (1 - config.stopLoss / 100),
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ];
      
      setActiveOrders(mockOrders);
      setBotStatus('running');
      toast.success("Το bot ξεκίνησε επιτυχώς");
      
    } catch (error) {
      console.error("Error starting bot:", error);
      toast.error("Σφάλμα κατά την εκκίνηση του bot");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Σταματά το bot
  const stopBot = useCallback(() => {
    setIsLoading(true);
    try {
      // Σε πραγματική εφαρμογή θα στέλναμε εντολή στο API
      setBotStatus('idle');
      setActiveOrders([]);
      toast.success("Το bot σταμάτησε επιτυχώς");
    } catch (error) {
      console.error("Error stopping bot:", error);
      toast.error("Σφάλμα κατά τη διακοπή του bot");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    bots,
    activeBot,
    setActiveBot,
    isCreating,
    isLoading,
    botStatus,
    activeOrders,
    loadBots,
    createBot,
    startBot,
    stopBot
  };
}
