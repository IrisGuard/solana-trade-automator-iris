
export interface BotConfig {
  selectedToken?: string;
  maxAmount?: number;
  buyThreshold?: number;
  sellThreshold?: number;
  stopLoss?: number;
  takeProfitLevel?: number;
  name?: string;
  quoteToken?: string;
  allocation?: number;
  maxTrade?: number;
  takeProfit?: number;
  riskLevel?: number;
  autoCompound?: boolean;
  profit?: string;
  timeRunning?: string;
  [key: string]: any;
}

export interface BotRow {
  id: string;
  name: string;
  strategy: string;
  user_id: string;
  active: boolean;
  config: BotConfig;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBotParams {
  name: string;
  strategy: string;
  user_id: string;
  active: boolean;
  config: BotConfig;
}
