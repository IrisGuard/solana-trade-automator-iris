
import { Token } from '@/types/wallet';

export interface TradingBotConfig {
  selectedToken: string | null;
  buyThreshold: number;
  sellThreshold: number;
  tradeAmount: number;
  stopLoss: number;
  takeProfit: number;
  strategy: 'grid' | 'dca' | 'momentum';
  autoReinvest: boolean;
}

export type BotStatus = 'idle' | 'running' | 'paused' | 'error';

export interface TradingOrder {
  id: string;
  type: 'buy' | 'sell';
  tokenSymbol: string;
  amount: number;
  price: number;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: string;
}
