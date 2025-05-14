
export interface TradingBotConfig {
  selectedToken: string | null;
  buyThreshold: number;
  sellThreshold: number;
  stopLoss: number;
  takeProfit: number;
  maxBudget: number;
  tradeAmount: number;
  strategy?: 'simple' | 'advanced' | 'custom';
  enabledStrategies: {
    dca: boolean;
    grid: boolean;
    momentum: boolean;
  };
  trailingStop?: boolean;
  autoRebalance?: boolean;
}

export interface ActiveOrder {
  id: string;
  type: 'buy' | 'sell' | 'stop-loss' | 'take-profit' | 'limit-buy' | 'limit-sell';
  token: string;
  price: number;
  amount: number;
  status: 'pending' | 'executed' | 'canceled';
  createdAt: string | Date;
  timestamp?: string | Date; // For backward compatibility
}

export interface TradingOrder {
  id: string;
  type: string;
  price: number;
  amount: number;
}

export interface TradingBotHook {
  config: TradingBotConfig;
  updateConfig: (config: Partial<TradingBotConfig>) => void;
  selectToken: (token: string | null) => Promise<void>;
  startBot: () => void;
  stopBot: () => void;
  botStatus: 'idle' | 'running' | 'paused';
  isLoading: boolean;
  tokens: any[];
  selectedTokenPrice: any;
  selectedTokenDetails?: any;
  activeOrders: ActiveOrder[];
}

// Utils 
export type ErrorOptions = {
  showToast?: boolean;
  logToConsole?: boolean;
  useCollector?: boolean;
  title?: string;
  component?: string;
  details?: any;
  source?: string;
  sendToChat?: boolean;
};

export type TestErrorOptions = {
  component?: string;
  message?: string;
  useToast?: boolean;
  isAsync?: boolean;
  severity?: 'error' | 'warning' | 'info';
  code?: string;
};
