
import * as supabaseJs from '@supabase/supabase-js';

// Use the createClient function from the namespace import
const { createClient } = supabaseJs;

// Hardcoded values for reliability - these are already public values
const SUPABASE_URL = 'https://lvkbyfocssuzcdphpmfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Export default DB client for backward compatibility
export const dbClient = supabase;

// Add error logging for critical operations
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`Auth state changed: ${event}`);
});

// Simple check function to verify the client is working
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    return !error;
  } catch (e) {
    console.error('Failed to connect to Supabase:', e);
    return false;
  }
}

// Type for database tables, to be fully defined when needed
export type Tables = any;
