
import { Token } from '@/types/wallet';

export interface TradingBotConfig {
  selectedToken: string | null;
  strategy: 'simple' | 'advanced' | 'custom';
  tradeAmount: number;
  buyThreshold: number;
  sellThreshold: number;
  stopLoss: number;
  takeProfit: number;
  autoRebalance: boolean;
  trailingStop: boolean;
}

export type BotStatus = 'running' | 'idle' | 'paused';

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
  status: 'running' | 'idle' | 'paused' | 'error';
  token: string;
  strategy: string;
  profitLoss: number;
  createdAt: string;
  updatedAt: string;
}

export interface TradingOrder {
  id: string;
  type: 'buy' | 'sell' | 'stop-loss' | 'take-profit';
  token: string;
  amount: number;
  price: number;
  status: 'pending' | 'executed' | 'canceled';
  createdAt: string;
}

export interface ActiveOrder {
  id: string;
  type: 'buy' | 'sell' | 'stop-loss' | 'take-profit';
  token: string;
  amount: number;
  price: number;
  status: 'pending' | 'executed' | 'canceled';
  createdAt: string;
}

export interface BotAction {
  type: 'buy' | 'sell' | 'stop-loss' | 'take-profit';
  token: string;
  price: number;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'executed' | 'failed';
}

export interface TradingBotHook {
  // Bot state
  bots: Bot[];
  activeBot: Bot | null;
  isCreating: boolean;
  isLoading: boolean;
  selectedToken: string | null;
  tokenPrice: number;
  botStatus: BotStatus;
  activeOrders: ActiveOrder[];
  selectedTokenPrice: TokenPriceInfo | null;
  selectedTokenDetails: Token | undefined;
  tokens: Token[];
  connected: boolean;
  
  // Bot configuration
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  
  // Bot actions
  loadBots: () => Promise<Bot[]>;
  selectToken: (token: string | null) => Promise<void>;
  setActiveBot: (bot: Bot | null) => void;
  createBot: (config: TradingBotConfig) => Promise<Bot | null>;
  startBot: () => void;
  stopBot: () => void;
  cleanup: () => void;
}
