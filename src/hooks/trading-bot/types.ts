
import { Token } from '@/types/wallet';

export type BotStatus = 'idle' | 'running' | 'paused' | 'error';

export interface TokenPriceInfo {
  price: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated: Date;
  currentPrice?: number;
}

export interface ActiveOrder {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  token: Token | null;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface TradingBotConfig {
  selectedToken: string | null;
  quoteToken: string;
  tradingAmount: number;
  maxTrade: number;
  stopLoss: number;
  takeProfit: number;
  strategy: string;
  autoRebalance: boolean;
  trailingStop: boolean;
  buyThreshold: number;
  sellThreshold: number;
  tradeAmount: number;
}

export interface BotConfig {
  amount: number;
  strategy: string;
  buyThreshold: number;
  sellThreshold: number;
  autoTrading?: boolean;
  maxSlippage?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface TradingBotHook {
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  startBot: () => Promise<void>;
  stopBot: () => Promise<void>;
  selectToken: (tokenAddress: string | null) => Promise<void>;
  isLoading: boolean;
  botStatus: BotStatus;
  activeOrders?: ActiveOrder[];
  selectedTokenPrice: TokenPriceInfo | null;
  selectedTokenDetails: Token | null | undefined;
  tokens?: Token[];
  connected: boolean;
  transactions: any[];
}
