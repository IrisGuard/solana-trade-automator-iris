
import { Token } from "@/types/wallet";

export type StrategyType = 'simple' | 'advanced' | 'custom';
export type BotStatus = 'idle' | 'running' | 'paused' | 'error';
export type OrderType = 'buy' | 'sell' | 'stop-loss' | 'take-profit' | 'limit-buy' | 'limit-sell';

export interface TradingBotConfig {
  selectedToken: string | null;
  strategy: StrategyType;
  buyThreshold: number;
  sellThreshold: number;
  stopLoss: number;
  takeProfit: number;
  tradeAmount: number;
  maxBudget: number;
  trailingStop: boolean;
  autoRebalance: boolean;
}

export interface ActiveOrder {
  id: string;
  type: OrderType;
  token: string;
  amount: number;
  price: number;
  status: 'pending' | 'executed' | 'cancelled';
  createdAt: string;
}

export interface TradingOrder {
  id: string;
  type: OrderType;
  token: string;
  amount: number;
  price: number;
  status: 'pending' | 'executed' | 'cancelled';
  createdAt: string;
}

export interface TokenPriceInfo {
  currentPrice: number;
  priceChange24h: number;
  volume24h?: number;
  lastUpdated: Date;
}

export interface Bot {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  token: string;
  strategy: string;
  profitLoss: number;
  createdAt: string;
  updatedAt: string;
}

export interface TradingBotHook {
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  selectToken: (token: string | null) => Promise<void>;
  startBot: () => void;
  stopBot: () => void;
  isLoading: boolean;
  botStatus: BotStatus;
  activeOrders: TradingOrder[];
  tokens: Token[];
  selectedTokenPrice: any;
  selectedTokenDetails: Token | undefined;
}
