import { useState, useEffect, useCallback, useRef } from '../../react-compatibility';
import { toast } from 'sonner';
import { TradingBotConfig, BotStatus, TradingOrder } from "./types";

export function useBotActions(config: TradingBotConfig) {
  const [botStatus, setBotStatus] = useState<BotStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [activeOrders, setActiveOrders] = useState<TradingOrder[]>([]);
  const intervalRef = useRef<number | null>(null);

  const startBot = useCallback(() => {
    setIsLoading(true);
    setBotStatus('running');
    toast.success('Trading bot started!');

    // Simulate placing orders every 10 seconds
    intervalRef.current = window.setInterval(() => {
      const newOrder: TradingOrder = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        tokenSymbol: config.selectedToken || 'DEMO',
        amount: config.tradeAmount,
        price: Math.random() * 100,
        status: 'open',
        createdAt: new Date().toISOString(),
      };
      setActiveOrders(prevOrders => [...prevOrders, newOrder]);
      toast.info(`New order placed: ${newOrder.type} ${newOrder.amount} ${newOrder.tokenSymbol} at ${newOrder.price}`);
    }, 10000);

    setIsLoading(false);
  }, [config]);

  const stopBot = useCallback(() => {
    setIsLoading(true);
    setBotStatus('idle');
    toast.info('Trading bot stopped.');

    // Clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Cancel all active orders
    setActiveOrders(prevOrders => {
      const cancelledOrders = prevOrders.map(order => ({ ...order, status: 'cancelled' }));
      toast.warning('All active orders cancelled.');
      return cancelledOrders;
    });

    setIsLoading(false);
  }, []);

  return {
    botStatus,
    isLoading,
    startBot,
    stopBot,
    activeOrders
  };
}
