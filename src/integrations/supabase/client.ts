
// Import with default syntax instead of named imports
import { supabaseConfig } from '@/utils/supabaseConfig';
import supabase from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const dbClient = supabase.createClient(
  supabaseConfig.url, 
  supabaseConfig.anonKey
);

// Export as supabase for backward compatibility
export const supabase = dbClient;

// Type for database tables
export type Tables = any; // This is a placeholder until proper types are generated
