
import { Token } from '@/types/wallet';

export type BotStatus = 'idle' | 'running' | 'paused';

export interface TradingBotConfig {
  selectedToken: string | null;
  buyThreshold: number;
  sellThreshold: number;
  stopLoss: number;
  takeProfit: number;
  maxBudget: number;
  tradeAmount?: number;
  trailingStop?: number;
  autoRebalance?: boolean;
  strategy?: string;
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
  status: 'pending' | 'executed' | 'cancelled';
  createdAt: Date;
  executedAt?: Date;
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

export interface ActiveOrder {
  id: string;
  type: string;
  price: number;
  amount: number;
  token: string;
  timestamp: Date;
}

export interface TokenPriceInfo {
  price: number;
  priceChange24h: number;
  volume24h?: number;
  lastUpdated: Date;
}

export interface Bot {
  id: string;
  name: string;
  status: BotStatus;
  token: string;
  createdAt: Date;
  stats: {
    profit: number;
    trades: number;
    winRate: number;
  };
}
