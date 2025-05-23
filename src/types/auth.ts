
// Define our own types instead of importing from Supabase
import type { Session, User } from '@supabase/supabase-js';

export interface User {
  id: string;
  email?: string;
  created_at?: string;
  [key: string]: any;
}

export type Session = Session;

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
}

export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}
