
export interface BotConfig {
  selectedToken?: string;
  maxAmount?: number;
  buyThreshold?: number;
  sellThreshold?: number;
  stopLoss?: number;
  takeProfitLevel?: number;
  name?: string;
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
