
// This file is maintained for compatibility with existing code
// New code should use @/integrations/supabase/client directly
export { supabase, dbClient } from '@/integrations/supabase/client';
export type { Tables } from '@/integrations/supabase/client';
// Export extended types for convenience
export type { 
  BotConfig, 
  ProfileRow, 
  WalletRow, 
  TokenRow, 
  TransactionRow, 
  BotRow, 
  ApiKeysRow 
} from '@/types/supabase-extensions';
