
import { Token } from '@/types/wallet';
import { Order } from '@/types/orders';

// Define interface for bot configuration
export interface TradingBotConfig {
  selectedToken: string | null;
  tradeAmount: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  maxTrades: number;
}

// Define interface for token price information
export interface TokenPriceInfo {
  price: number;
  priceChange24h: number;
}

// Define interface for bot status
export type BotStatus = 'idle' | 'running' | 'paused';

// Define interface for trading bot state
export interface TradingBotState {
  bots: any[];
  activeBot: any | null;
  isCreating: boolean;
  isLoading: boolean;
  selectedToken: string | null;
  tokenPrice: any;
  priceSubscription: any;
  botStatus: BotStatus;
  activeOrders: Order[];
  selectedTokenDetails: Token | undefined;
  selectedTokenPrice: TokenPriceInfo | null;
  tokens: Token[];
}

// Define interface for trading bot hooks return value
export interface TradingBotHook {
  // Bot state
  bots: any[];
  activeBot: any | null;
  isCreating: boolean;
  isLoading: boolean;
  selectedToken: string | null;
  tokenPrice: any;
  botStatus: BotStatus;
  activeOrders: Order[];
  selectedTokenPrice: TokenPriceInfo | null;
  selectedTokenDetails: Token | undefined;
  tokens: Token[];
  connected: boolean;
  
  // Bot configuration
  config: TradingBotConfig;
  updateConfig: (newConfig: Partial<TradingBotConfig>) => void;
  
  // Bot actions
  loadBots: () => Promise<void>;
  selectToken: (token: string | null) => Promise<void>;
  setActiveBot: (bot: any) => void;
  createBot: (botConfig: any) => Promise<any | null>;
  startBot: () => void;
  stopBot: () => void;
  cleanup: () => void;
}
