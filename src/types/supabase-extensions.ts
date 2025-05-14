
// Extended types for Supabase tables
export interface ProfileRow {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface WalletRow {
  id: string;
  user_id: string;
  address: string;
  blockchain: string;
  is_primary: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  last_connected?: string | null;
}

export interface TokenRow {
  id: string;
  user_id: string;
  token_address: string;
  name: string;
  symbol: string;
  amount?: number | null;
  logo?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface TransactionRow {
  id: string;
  signature: string;
  wallet_address: string;
  user_id: string;
  type: string;
  status: string;
  amount: string;
  source?: string | null;
  destination?: string | null;
  block_time?: string | null;
  created_at?: string | null;
}

export interface BotRow {
  id: string;
  user_id: string;
  name: string;
  strategy: string;
  active?: boolean | null;
  config?: BotConfig | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BotConfig {
  selectedToken?: string | null;
  buyThreshold?: number | null;
  sellThreshold?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  tradeAmount?: number | null;
  maxBudget?: number | null;
  strategy?: string | null;
  autoRebalance?: boolean | null;
  trailingStop?: boolean | null;
  profit?: string | null;
  timeRunning?: string | null;
  quoteToken?: string | null;
  enabledStrategies?: {
    dca?: boolean;
    grid?: boolean;
    momentum?: boolean;
  } | null;
}

export interface ApiKeysRow {
  id: string;
  user_id: string;
  name: string;
  key_value: string;
  service: string;
  description?: string | null;
  status?: string | null;
  is_encrypted?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}
