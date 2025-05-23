
// Import Supabase client correctly using the default export
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use the correct Supabase URL and anon key for production
const supabaseUrl = 'https://lvkbyfocssuzcdphpmfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc';

// Create Supabase client with proper configuration for production
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'solana-trade-automator'
    }
  }
});

// Export supabaseClient as alias for compatibility
export { supabaseClient as supabase };
export const dbClient = supabaseClient;

// Enhanced function to check Supabase connection with better error handling
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Use a simple select query that works on any Supabase project
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('count', { count: 'exact', head: true })
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    
    console.log('[Success] Supabase connection verified');
    return true;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

// Function to test database operations
export const testDatabaseOperations = async (): Promise<boolean> => {
  try {
    // Test basic operations
    const { error: selectError } = await supabaseClient
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows found, which is OK
      console.error('Database select test failed:', selectError);
      return false;
    }
    
    console.log('[Success] Database operations test passed');
    return true;
  } catch (error) {
    console.error('Database operations test failed:', error);
    return false;
  }
};
