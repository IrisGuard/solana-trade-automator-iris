
import { Token } from '@/types/wallet';

export interface TradingBotConfig {
  selectedToken: string | null;
  buyThreshold: number;
  sellThreshold: number;
  tradeAmount: number;
  stopLoss: number;
  takeProfit: number;
  strategy: 'grid' | 'dca' | 'momentum' | 'simple' | 'advanced' | 'custom';
  autoReinvest: boolean;
  maxBudget?: number;
  trailingStop?: boolean;
  autoRebalance?: boolean;
  enabledStrategies?: {
    dca: boolean;
    grid: boolean;
    momentum: boolean;
  };
}

export type BotStatus = 'idle' | 'running' | 'paused' | 'error';

export interface TradingOrder {
  id: string;
  type: 'buy' | 'sell' | 'stop-loss' | 'take-profit';
  tokenSymbol: string;
  amount: number;
  price: number;
  status: 'open' | 'filled' | 'cancelled' | 'pending';
  createdAt: string;
  token?: string; // Added for backward compatibility
}

export type BotActionStatus = 'idle' | 'loading' | 'success' | 'error';
