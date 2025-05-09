
import type { Tables } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

export type UserType = {
  id: string;
  email?: string;
  created_at?: string;
  profile?: Partial<Tables['profiles']>;
};

export interface AuthContextType {
  user: UserType | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any; success?: boolean }>;
  signUp: (email: string, password: string) => Promise<{ error?: any; success?: boolean }>;
  signOut: () => Promise<{ error?: any; success?: boolean }>;
}
