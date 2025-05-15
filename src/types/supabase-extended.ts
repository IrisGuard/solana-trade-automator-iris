
// This file extends the generated Supabase types with additional custom types
import type { Tables as GeneratedTables } from '@/integrations/supabase/types';

// Re-export types from the generated types file
export type { Tables } from '@/integrations/supabase/types';

// Extended table row types with additional properties
export interface ProfileRowExtended extends GeneratedTables['profiles']['Row'] {
  // Add any extended properties here
  isActive?: boolean;
}

export interface ApiKeyRowExtended extends GeneratedTables['api_keys_storage']['Row'] {
  isVisible?: boolean;
  isWorking?: boolean;
}

// Custom API key types
export interface CustomApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  createdAt: string;
  description?: string;
  status?: 'active' | 'expired' | 'revoked';
  source?: 'local' | 'supabase';
  isVisible?: boolean;
  isWorking?: boolean;
}
