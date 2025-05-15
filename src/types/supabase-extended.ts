
// This file extends the generated Supabase types with additional custom types
import type { Tables as GeneratedTables } from '@/integrations/supabase/types';

// Re-export types from the generated types file
export type { Tables } from '@/integrations/supabase/types';

// Extended table row types with additional properties
export interface ProfileRowExtended {
  // Include all properties from the generated type
  id: string;
  avatar_url: string | null;
  created_at: string | null;
  full_name: string | null;
  updated_at: string | null;
  // Add any extended properties here
  isActive?: boolean;
}

export interface ApiKeyRowExtended {
  // Include all properties from the generated type
  id: string;
  name: string;
  key_value: string;
  service: string;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  description: string | null;
  status: string | null;
  is_encrypted: boolean | null;
  // Add extended properties
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
