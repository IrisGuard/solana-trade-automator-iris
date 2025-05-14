
import { Token } from "@/types/wallet";

export type BotStatus = 'idle' | 'running' | 'paused' | 'error';

export type StrategyType = 'simple' | 'dca' | 'grid' | 'momentum';

export interface BotMetrics {
  profit: number;
  profitPercent: number;
  trades: number;
  successRate: number;
}

export interface TradingBotConfig {
  selectedToken: string | null;
  buyThreshold: number;
  sellThreshold: number;
  stopLoss: number;
  takeProfit: number;
  tradeAmount: number;
  maxBudget: number;
  strategy: StrategyType;
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
  type: 'buy' | 'sell' | 'stop-loss' | 'take-profit';
  price: number;
  amount: number;
  tokenAddress: string;
  token: string;  // This is the token address or symbol
  status: 'pending' | 'executed' | 'cancelled';
  createdAt: Date;
}

// For backward compatibility with ActiveOrder
export type ActiveOrder = TradingOrder;

export interface TradingBotHook {
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
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
