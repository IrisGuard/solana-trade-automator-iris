
import type { Database } from '@/integrations/supabase/types';

// Re-export the Tables type from the generated types
export type Tables = Database['public']['Tables'];

// Add custom types extending the generated ones
export type CustomApiKey = Tables['api_keys_storage']['Row'] & {
  isVisible?: boolean;
  isWorking?: boolean;
  isTesting?: boolean;
};

// Define a custom type for API endpoints since the table might not exist yet in the schema
export type CustomApiEndpoint = {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

// Add any other custom types needed that would otherwise require modifying the read-only file
