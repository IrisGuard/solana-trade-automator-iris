
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase URL and anon key - using the project values from supabase/config.toml
const supabaseUrl = 'https://lvkbyfocssuzcdphpmfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'solana-trading-bot-auth-token',
  }
});

// Re-export for compatibility with existing code
export const dbClient = supabase;

// Export Tables type with proper generic arguments for convenience
export type Tables = Database['public']['Tables'];
