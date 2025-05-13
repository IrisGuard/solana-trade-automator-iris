
import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { AuthContextType } from '@/types/auth';
import { authService } from '@/services/authService';

// Δημιουργούμε το context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Δημιουργούμε τον provider
export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const supabaseAuth = useSupabaseAuth();
  
  // Μετατροπή του supabaseAuth στο format που περιμένει το AuthContextType
  const auth: AuthContextType = {
    user: supabaseAuth.user ? {
      id: supabaseAuth.user.id,
      email: supabaseAuth.user.email,
      created_at: supabaseAuth.user.created_at,
      profile: supabaseAuth.profile
    } : null,
    session: supabaseAuth.session,
    loading: supabaseAuth.isLoading,
    signIn: async (email, password) => {
      try {
        return await authService.signInWithPassword(email, password);
      } catch (error) {
        return { error };
      }
    },
    signUp: async (email, password) => {
      try {
        return await authService.signUp(email, password);
      } catch (error) {
        return { error };
      }
    },
    signOut: async () => {
      try {
        await supabaseAuth.signOut();
        return { success: true };
      } catch (error) {
        return { error };
      }
    }
  };
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Δημιουργούμε και εξάγουμε το hook για να χρησιμοποιήσουμε το context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
