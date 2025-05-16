
import { Token } from "@/types/wallet";

export type BotStatus = 'idle' | 'running' | 'paused' | 'error';

export type OrderType = 'buy' | 'sell' | 'stop-loss' | 'take-profit' | 'limit-buy' | 'limit-sell';

export type OrderStatus = 'pending' | 'completed' | 'canceled' | 'failed';

export interface TradingOrder {
  id: string;
  type: OrderType;
  price: number;
  amount: number;
  token: string;
  status: OrderStatus;
  createdAt: string;
  executedAt?: string;
}

export interface TradingBotConfig {
  selectedToken: string | null;
  buyThreshold: number;
  sellThreshold: number;
  stopLoss: number;
  takeProfit: number;
  tradeAmount: number;
  maxBudget: number;
  strategy: 'simple' | 'advanced' | 'custom' | 'dca' | 'grid' | 'momentum';
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

// Additional exports for useBotActions.ts
export interface Bot {
  id: string;
  name: string;
  status: string;
  token: string;
  strategy: string;
  profitLoss: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveOrder {
  id: string;
  type: string;
  token: string;
  amount: number;
  price: number;
  status: string;
  createdAt: string;
}

export interface TokenPriceInfo {
  price: number;
  change24h: number;
  highPrice24h?: number;
  lowPrice24h?: number;
}
