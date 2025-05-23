
// Import Supabase client using default import for maximum compatibility
import supabaseJs from '@supabase/supabase-js';
import type { Database } from './types';

// Extract createClient from the default import
const { createClient } = supabaseJs;

// Use the correct Supabase URL and anon key for production
const supabaseUrl = 'https://lvkbyfocssuzcdphpmfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc';

// Create Supabase client with proper configuration
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Export supabaseClient as alias for compatibility
export { supabaseClient as supabase };
export const dbClient = supabaseClient;

// Function to check Supabase connection
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabaseClient.from('profiles').select('count', { count: 'exact', head: true });
    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};
