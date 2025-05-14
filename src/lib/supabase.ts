
// This file is maintained for compatibility with existing code
// New code should use @/integrations/supabase/client directly
export { supabase, dbClient, type Tables } from '@/integrations/supabase/client';
export type { 
  BotConfig, 
  ProfileRow, 
  WalletRow, 
  TokenRow, 
  TransactionRow, 
  BotRow, 
  ApiKeysRow 
} from '@/types/supabase-extensions';
