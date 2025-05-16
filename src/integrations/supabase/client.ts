
import { supabaseConfig } from '@/utils/supabaseConfig';
// Import from specific entry point which is consistent across versions
import { createClient } from '@supabase/supabase-js/dist/module';
import type { Database } from '@/integrations/supabase/types';
import type { ExtendedDatabase } from './types-extension';

// Create a single supabase client for interacting with your database
export const dbClient = createClient<ExtendedDatabase>(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

// Export as supabase for backward compatibility
export const supabase = dbClient;

// Type for database tables
export type Tables = any; // This is a placeholder until proper types are generated
