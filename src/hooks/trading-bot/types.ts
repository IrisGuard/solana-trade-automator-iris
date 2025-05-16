
import { Token } from "@/types/wallet";

export type OrderType = 'buy' | 'sell' | 'limit' | 'stop';

export interface TradingOrder {
  id: string;
  type: OrderType;
  token: string;
  price: number;
  amount: number;
  status: 'pending' | 'executed' | 'canceled';
  createdAt: Date;
}

export interface ActiveOrder {
  id: string;
  type: string;
  token: string;
  price: number;
  amount: number;
  status: string;
  createdAt: Date;
}

export interface TokenPriceInfo {
  price: number;
  change24h: number;
  highPrice24h: number;
  lowPrice24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: Date;
  priceChange24h: number;
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
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  selectToken: (token: string | null) => Promise<void>;
  startBot: () => void;
  stopBot: () => void;
  isLoading: boolean;
  botStatus: 'idle' | 'running' | 'paused' | 'error';
  activeOrders: TradingOrder[];
  selectedTokenPrice: TokenPriceInfo | null;
  selectedTokenDetails: Token | undefined;
  tokens: Token[];
  connected: boolean;
}
