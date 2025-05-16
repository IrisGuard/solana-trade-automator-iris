
// Import with renamed import to avoid naming conflicts
import { supabaseConfig } from '@/utils/supabaseConfig';
// Import the Supabase package correctly for version 2.x
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/integrations/supabase/types';

// Create a single supabase client for interacting with your database
export const dbClient = createBrowserClient<Database>(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

// Export as supabase for backward compatibility
export const supabase = dbClient;

// Type for database tables
export type Tables = any; // This is a placeholder until proper types are generated
