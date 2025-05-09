
import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth, UserType } from '@/hooks/useSupabaseAuth';

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any; success?: boolean }>;
  signUp: (email: string, password: string) => Promise<{ error?: any; success?: boolean }>;
  signOut: () => Promise<{ error?: any; success?: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const auth = useSupabaseAuth();
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
