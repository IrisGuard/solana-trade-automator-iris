
import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { AuthContextType, Profile } from '@/types/auth';
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
    } : null,
    session: supabaseAuth.session,
    loading: supabaseAuth.loading,
    error: supabaseAuth.error,
    initialized: !supabaseAuth.loading,
    
    signIn: async (email, password) => {
      try {
        const result = await authService.signInWithPassword(email, password);
        return { error: result.error || null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    
    signUp: async (email, password) => {
      try {
        const result = await authService.signUp(email, password);
        return { error: result.error || null, data: result.user || null };
      } catch (error) {
        return { error: error as Error, data: null };
      }
    },
    
    signOut: async () => {
      try {
        await supabaseAuth.signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },
    
    resetPassword: async (email) => {
      try {
        // Implementation would depend on your authService
        await authService.resetPassword?.(email);
        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    
    updateProfile: async (profile: Partial<Profile>) => {
      try {
        // Implementation would depend on your authService
        console.log("Updating profile:", profile);
        return { error: null };
      } catch (error) {
        return { error: error as Error };
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
