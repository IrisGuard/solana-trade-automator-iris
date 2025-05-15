
// Import with renamed import to avoid naming conflicts
import { supabaseConfig } from '@/utils/supabaseConfig';
import * as supabaseLib from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const dbClient = supabaseLib.createClient(
  supabaseConfig.url, 
  supabaseConfig.anonKey
);

// Export as supabase for backward compatibility
export const supabase = dbClient;

// Type for database tables
export type Tables = any; // This is a placeholder until proper types are generated
