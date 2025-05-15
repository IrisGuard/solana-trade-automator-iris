
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { AuthContextType, AuthState } from '@/types/auth';
import { errorCollector } from '@/utils/error-handling/collector';

// Create auth context
const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    initialized: false,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session 
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          // Get user data
          const { data: { user } } = await supabase.auth.getUser();
          
          setAuthState({
            user,
            session,
            loading: false, 
            error: null,
            initialized: true,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
            initialized: true,
          });
        }
      } catch (error) {
        errorCollector.captureError(error as Error, {
          component: 'SupabaseAuthProvider',
          source: 'auth-initialization'
        });
        
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: error as Error,
          initialized: true,
        });
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN') {
          const { data: { user } } = await supabase.auth.getUser();
          
          setAuthState({
            user,
            session,
            loading: false,
            error: null,
            initialized: true,
          });
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
            initialized: true,
          });
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      errorCollector.captureError(error as Error, { 
        component: 'AuthProvider',
        source: 'signIn'
      });
      
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      return { error: null, data };
    } catch (error) {
      errorCollector.captureError(error as Error, { 
        component: 'AuthProvider',
        source: 'signUp'
      });
      
      return { error: error as Error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      errorCollector.captureError(error as Error, { 
        component: 'AuthProvider',
        source: 'signOut'
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      errorCollector.captureError(error as Error, { 
        component: 'AuthProvider',
        source: 'resetPassword'
      });
      
      return { error: error as Error };
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', authState.user?.id);
        
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      errorCollector.captureError(error as Error, { 
        component: 'AuthProvider',
        source: 'updateProfile'
      });
      
      return { error: error as Error };
    }
  };

  return (
    <SupabaseAuthContext.Provider
      value={{
        ...authState,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
}

// Custom hook for using auth
export function useAuth() {
  const context = useContext(SupabaseAuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  
  return context;
}
