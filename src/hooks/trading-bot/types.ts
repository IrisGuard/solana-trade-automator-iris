
import { Token } from "@/types/wallet";

export type BotStatus = 'idle' | 'running' | 'paused' | 'error';

export type OrderType = 'buy' | 'sell' | 'stop-loss' | 'take-profit';

export type OrderStatus = 'pending' | 'executed' | 'canceled' | 'failed';

export interface TradingOrder {
  id: string;
  type: OrderType;
  price: number;
  amount: number;
  token: string;
  status: OrderStatus;
  createdAt: Date;
  executedAt?: Date;
}

export interface TradingBotConfig {
  selectedToken: string | null;
  buyThreshold: number;
  sellThreshold: number;
  stopLoss: number;
  takeProfit: number;
  tradeAmount: number;
  maxBudget: number;
  strategy: 'simple' | 'dca' | 'grid' | 'momentum';
  autoRebalance: boolean;
  trailingStop: boolean;
  enabledStrategies: {
    dca: boolean;
    grid: boolean;
    momentum: boolean;
  };
}

export interface TradingBotHook {
  config: TradingBotConfig;
  updateConfig: (newConfig: Partial<TradingBotConfig>) => void;
  selectToken: (tokenAddress: string | null) => Promise<void>;
  startBot: () => void;
  stopBot: () => void;
  isLoading: boolean;
  botStatus: BotStatus;
  activeOrders: TradingOrder[];
  selectedTokenPrice: { price: number; priceChange24h: number } | null;
  selectedTokenDetails: Token | undefined;
  tokens: Token[];
  connected: boolean;
}
