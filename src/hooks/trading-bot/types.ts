
export interface TokenPriceInfo {
  price: number;
  change24h?: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated?: Date;
}

export type BotStatus = 'idle' | 'running' | 'paused' | 'error';

export interface TradingBotConfig {
  selectedToken: string | null;
  quoteToken: string;
  tradingAmount: number;
  maxTrade: number;
  stopLoss: number | null;
  takeProfit: number | null;
  strategy: 'simple' | 'advanced' | 'custom';
  autoRebalance: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  autoCompound: boolean;
}

export interface TradingOrder {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  token: string;
  status: 'pending' | 'executed' | 'canceled' | 'failed';
  createdAt: Date;
}

export interface ActiveOrder {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  token: string;
  status: 'pending' | 'executed' | 'canceled' | 'failed';
  createdAt: Date;
}

export interface BotConfig {
  selectedToken?: string;
  quoteToken?: string;
  tradingAmount?: number;
  maxTrade?: number;
  stopLoss?: number;
  takeProfit?: number;
  strategy?: 'simple' | 'advanced' | 'custom' | 'dca' | 'grid' | 'momentum' | 'arbitrage';
  autoRebalance?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
  autoCompound?: boolean;
}

export interface TradingBotHook {
  connected: boolean;
  selectedToken: string | null;
  selectedTokenPrice: TokenPriceInfo | null;
  selectedTokenDetails: any;
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  selectToken: (tokenAddress: string) => Promise<void>;
  botStatus: BotStatus;
  startBot: () => Promise<void>;
  stopBot: () => Promise<void>;
  isLoading: boolean;
  transactions: TradingOrder[];
  orders: ActiveOrder[];
}
