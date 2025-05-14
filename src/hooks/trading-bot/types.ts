
import type { Token } from '@/types/wallet';

export type BotStrategy = 'simple' | 'advanced' | 'custom' | 'dca' | 'grid' | 'momentum' | 'arbitrage';

export type BotStatus = 'idle' | 'running' | 'paused' | 'error';

export interface BotConfig {
  amount: number;
  strategy: BotStrategy;
  buyThreshold: number;
  sellThreshold: number;
  autoTrading: boolean;
  maxSlippage: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface TokenPriceInfo {
  price: number;
  priceChange24h: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated: Date;
}

export interface TradingOrder {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  tokenAddress: string;
  tokenSymbol: string;
  timestamp: Date;
}

export interface ActiveOrder {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  token: Token;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface TradingBotHook {
  config: BotConfig;
  updateConfig: (config: Partial<BotConfig>) => void;
  startBot: () => void;
  stopBot: () => void;
  selectToken: (token: Token) => void;
  isLoading: boolean;
  botStatus: BotStatus;
  activeOrders: ActiveOrder[];
  selectedTokenPrice: TokenPriceInfo | null;
  selectedTokenDetails: Token | null;
  tokens: Token[];
  connected: boolean;
}
