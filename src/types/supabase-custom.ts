
import type { Database } from '@/integrations/supabase/types';

// Re-export the Tables type from the generated types
export type Tables = Database['public']['Tables'];

// Add custom types extending the generated ones
export type CustomApiKey = Tables['api_keys_storage']['Row'] & {
  isVisible?: boolean;
  isWorking?: boolean;
  isTesting?: boolean;
};

export type CustomApiEndpoint = Tables['api_endpoints']['Row'] & {
  isActive?: boolean;
};

// Add any other custom types needed that would otherwise require modifying the read-only file
