
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/utils/supabaseConfig';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseConfig.url, 
  supabaseConfig.anonKey
);

// Export a database client alias for backward compatibility
export const dbClient = supabase;
