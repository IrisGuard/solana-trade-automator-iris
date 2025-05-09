
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lvkbyfocssuzcdphpmfu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc";

// Create a typed client with the Database interface
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Type assertion helper for database tables
export type Tables = {
  profiles: {
    id: string;
    full_name?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
  };
  wallets: {
    id: string;
    user_id: string;
    address: string;
    blockchain: string;
    is_primary: boolean;
    last_connected: string;
    created_at: string;
    updated_at: string;
  };
  tokens: {
    id: string;
    user_id: string;
    token_address: string;
    name: string;
    symbol: string;
    amount: number;
    logo?: string;
    created_at: string;
    updated_at: string;
  };
  transactions: {
    id: string;
    user_id: string;
    wallet_address: string;
    signature: string;
    block_time?: string;
    type: string;
    status: string;
    amount: string;
    source?: string;
    destination?: string;
    created_at: string;
  };
  bots: {
    id: string;
    user_id: string;
    name: string;
    strategy: string;
    active: boolean;
    config: any;
    created_at: string;
    updated_at: string;
  };
};

// Create a version of the supabase client that has "any" type for database operations
// This allows us to bypass TypeScript's strict checking until we set up the actual database schema
export const dbClient = supabase as any;
