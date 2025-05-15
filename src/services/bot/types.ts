
export interface BotConfig {
  selectedToken?: string;
  tradingStrategy?: string;
  tradingAmount?: number;
  maxRiskLevel?: number;
  stopLoss?: number;
  takeProfit?: number;
  autoCompound?: boolean;
  tradingPairs?: string[];
  [key: string]: any; // Allow for additional dynamic properties
}

export interface Bot {
  id: string;
  name: string;
  strategy: string;
  active: boolean;
  config?: BotConfig;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface BotCreateParams {
  name: string;
  strategy: string;
  active?: boolean;
  config?: BotConfig;
  user_id: string;
}

export interface BotUpdateParams {
  name?: string;
  strategy?: string;
  active?: boolean;
  config?: BotConfig;
  updated_at: string;
}
