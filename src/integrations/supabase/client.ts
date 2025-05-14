
import { createClient } from '@supabase/supabase-js';

// Ελέγχουμε αν οι περιβαλλοντικές μεταβλητές είναι διαθέσιμες
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lvkbyfocssuzcdphpmfu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc';

// Δημιουργία του Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Alias for backward compatibility
export const dbClient = supabase;

// Τύποι για τους πίνακες της βάσης δεδομένων
export type Tables = {
  profiles: {
    id: string;
    username?: string | null;
    avatar_url?: string | null;
    updated_at?: string | null;
    created_at?: string;
    full_name?: string | null;
    role?: string | null;
  };
  error_logs: {
    id: string;
    user_id?: string | null;
    error_message: string;
    error_stack?: string | null;
    component?: string | null;
    source?: string;
    url?: string | null;
    browser_info?: any;
    created_at?: string;
  };
  tokens: {
    id: string;
    user_id: string;
    token_address: string;
    name: string;
    symbol: string;
    amount: number;
    logo?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  transactions: {
    id: string;
    user_id: string;
    wallet_address: string;
    signature: string;
    type: string;
    status: string;
    amount: string;
    source?: string | null;
    destination?: string | null;
    block_time?: string | null;
    created_at?: string;
  };
  wallets: {
    id: string;
    user_id: string;
    address: string;
    blockchain: string;
    is_primary: boolean;
    last_connected?: string;
    created_at?: string;
    updated_at?: string;
  };
};

// Εξαγωγή τύπων
export type Database = {
  public: {
    Tables: Tables;
  };
};
