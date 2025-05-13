
import type { Database } from '@/integrations/supabase/types';

// Re-export the Database type for convenience
export type { Database } from '@/integrations/supabase/types';

// Extended/supplementary types that don't require modifying the original types file
export type BotConfig = {
  selectedToken?: string;
  tradingAmount?: number;
  stopLoss?: number;
  takeProfit?: number;
  strategy?: 'dca' | 'grid' | 'momentum' | 'arbitrage';
  autoRebalance?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
};

// Type-safe helper for accessing Supabase tables
export type TableRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

// Specific table row types
export type ProfileRow = TableRow<'profiles'>;
export type WalletRow = TableRow<'wallets'>;
export type TokenRow = TableRow<'tokens'>;
export type TransactionRow = TableRow<'transactions'>;
export type BotRow = TableRow<'bots'>;
export type ApiKeysRow = TableRow<'api_keys_storage'>;
