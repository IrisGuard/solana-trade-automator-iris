
import type { Session, User } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Type for profile data from the database
export type ProfileData = Database['public']['Tables']['profiles']['Row'] | null;

// Extended User type with profile data
export interface ExtendedUser {
  id: string;
  email: string | null;
  created_at: string;
  profile: ProfileData;
}

// Authentication context type
export interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user?: User; error?: any }>;
  signUp: (email: string, password: string) => Promise<{ user?: User; error?: any }>;
  signOut: () => Promise<{ success?: boolean; error?: any }>;
}

// Response from sign-in/sign-up operations
export interface AuthResponse {
  user?: User;
  error?: any;
}
