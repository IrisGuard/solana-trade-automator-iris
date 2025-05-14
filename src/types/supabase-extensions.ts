
// TypeScript definitions for Supabase extensions

export interface BotConfig {
  selectedToken?: string;
  quoteToken?: string;
  allocation?: number;
  maxTrade?: number;
  takeProfit?: number;
  stopLoss?: number;
  riskLevel?: number;
  autoCompound?: boolean;
  profit?: string;
  timeRunning?: string;
  enabledStrategies?: {
    dca: boolean;
    grid: boolean;
    momentum: boolean;
  };
}

export interface ProfileRow {
  id: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
  created_at?: string;
}

export interface WalletRow {
  id: string;
  user_id: string;
  address: string;
  blockchain: string;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
  last_connected?: string;
}

export interface TokenRow {
  id: string;
  user_id: string;
  token_address: string;
  name: string;
  symbol: string;
  amount?: number;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  wallet_address: string;
  signature: string;
  type: string;
  status: string;
  amount: string;
  source?: string;
  destination?: string;
  block_time?: string;
  created_at?: string;
}

export interface BotRow {
  id: string;
  user_id: string;
  name: string;
  strategy: string;
  active?: boolean;
  config?: BotConfig;
  created_at?: string;
  updated_at?: string;
}

export interface ApiKeysRow {
  id: string;
  user_id: string;
  name: string;
  key_value: string;
  service: string;
  description?: string;
  status?: string;
  is_encrypted?: boolean;
  created_at?: string;
  updated_at?: string;
}
