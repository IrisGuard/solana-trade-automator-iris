
import { Token } from '@/types/wallet';

export type BotStatus = 'idle' | 'running' | 'paused';

export interface TradingBotConfig {
  selectedToken: string | null;
  buyThreshold: number;
  sellThreshold: number;
  stopLoss: number;
  takeProfit: number;
  tradeAmount: number;
  maxBudget: number;
  strategy: 'simple' | 'advanced' | 'custom';
  autoRebalance: boolean;
  trailingStop: boolean;
  enabledStrategies: {
    dca: boolean;
    grid: boolean;
    momentum: boolean;
  };
}

export interface TradingOrder {
  id: string;
  type: 'buy' | 'sell' | 'stop-loss' | 'take-profit' | 'limit-buy' | 'limit-sell';
  price: number;
  amount: number;
  tokenAddress: string;
  token: string; // Added for compatibility with ActiveOrder
  status: 'pending' | 'executed' | 'cancelled';
  createdAt: Date | string;
  executedAt?: Date;
}

export interface TokenPriceInfo {
  currentPrice: number;
  priceChange24h: number;
  highPrice24h: number;
  lowPrice24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface Bot {
  id: string;
  name: string;
  status: BotStatus;
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

export interface TradingBotHook {
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  selectToken: (token: string | null) => Promise<void>;
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
