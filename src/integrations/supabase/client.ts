
import { supabaseConfig } from '@/utils/supabaseConfig';
// Import the Supabase package correctly
import { createClientComponentClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Create a single supabase client for interacting with your database
export const dbClient = createClientComponentClient<Database>({
  supabaseUrl: supabaseConfig.url,
  supabaseKey: supabaseConfig.anonKey
});

// Export as supabase for backward compatibility
export const supabase = dbClient;

// Type for database tables
export type Tables = any; // This is a placeholder until proper types are generated
