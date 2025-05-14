
import { Token } from '@/types/wallet';

export type BotStatus = 'idle' | 'running' | 'paused';

export interface TradingBotConfig {
  selectedToken: string | null;
  buyThreshold: number;
  sellThreshold: number;
  stopLoss: number;
  takeProfit: number;
  maxBudget: number;
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
}
