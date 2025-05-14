
export interface TokenPriceInfo {
  price: number;
  priceChange24h: number;
  change24h?: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated?: Date;
  currentPrice?: number;
}

export type BotStatus = 'idle' | 'running' | 'paused' | 'error';

export interface TradingBotConfig {
  selectedToken: string | null;
  quoteToken?: string;
  tradingAmount: number;
  maxTrade?: number;
  stopLoss: number;
  takeProfit: number;
  buyThreshold: number;
  sellThreshold: number;
  strategy: 'simple' | 'advanced' | 'custom';
  autoRebalance: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
  autoCompound?: boolean;
  tradeAmount: number;
  trailingStop: boolean;
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
  token: any;
  status: 'pending' | 'executed' | 'canceled' | 'failed' | 'completed';
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
  buyThreshold?: number;
  sellThreshold?: number;
  amount?: number;
  autoTrading?: boolean;
  maxSlippage?: number;
}

export interface TradingBotHook {
  connected: boolean;
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  selectToken: (tokenAddress: string) => Promise<void>;
  botStatus: BotStatus;
  startBot: () => Promise<void>;
  stopBot: () => Promise<void>;
  isLoading: boolean;
  transactions: TradingOrder[];
  activeOrders: ActiveOrder[];
  selectedTokenPrice: TokenPriceInfo | null;
  selectedTokenDetails: any;
  tokens: any[];
}
