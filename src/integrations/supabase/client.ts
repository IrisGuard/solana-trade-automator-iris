
// Import with renamed import to avoid naming conflicts
import { supabaseConfig } from '@/utils/supabaseConfig';
// Import createClient directly from @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const dbClient = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

// Export as supabase for backward compatibility
export const supabase = dbClient;

// Type for database tables
export type Tables = any; // This is a placeholder until proper types are generated
