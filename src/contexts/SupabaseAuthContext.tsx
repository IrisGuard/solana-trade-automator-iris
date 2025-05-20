
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthContextType, AuthState, User, Session } from '@/types/auth';
import { errorCollector } from '@/utils/error-handling/collector';

// Create auth context
const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  console.log('Initializing auth provider...');
  
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
        // Set up auth state listener FIRST to prevent missing events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            
            // Important: only sync update state here to avoid deadlock
            setAuthState(current => ({
              ...current,
              user: session?.user as User || null,
              session: session as Session,
              loading: false,
              initialized: true,
              error: null
            }));
            
            // If session changed, defer fetching profile 
            if (session?.user && event === 'SIGNED_IN') {
              // Use setTimeout to avoid supabase auth deadlocks
              setTimeout(async () => {
                try {
                  // Fetch user profile or other data if needed
                  console.log('Fetching user profile after sign in');
                } catch (err) {
                  console.error('Error fetching profile:', err);
                }
              }, 0);
            }
          }
        );
        
        // THEN get existing session
        const { data, error } = await supabase.auth.getSession();
        console.log('Auth session initialized:', !!data.session);
        
        if (error) {
          throw error;
        }

        if (data.session) {
          // Update state with session
          setAuthState({
            user: data.session.user as User,
            session: data.session as Session,
            loading: false,
            error: null,
            initialized: true,
          });
        } else {
          // No session
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
            initialized: true,
          });
        }
        
        // Try auto-login if needed
        if (!data.session) {
          setTimeout(() => {
            console.log('No session found, trying auto-login');
            tryAutoLogin();
          }, 500);
        }
        
        return () => {
          // Clean up subscription
          subscription.unsubscribe();
        };
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
  }, []);
  
  const tryAutoLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'test_password_123!@#'
      });
      
      if (error) {
        console.log('Auto-login failed:', error.message);
        
        if (error.message.includes('Invalid login credentials')) {
          console.log('Trying to create test account...');
          const { error: signUpError } = await supabase.auth.signUp({
            email: 'test@example.com',
            password: 'test_password_123!@#'
          });
          
          if (signUpError) {
            console.error('Failed to create test account:', signUpError);
          } else {
            console.log('Test account created, attempting login again');
            await supabase.auth.signInWithPassword({
              email: 'test@example.com',
              password: 'test_password_123!@#'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in auto-login:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
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
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      errorCollector.captureError(error as Error, { 
        component: 'AuthProvider',
        source: 'signUp'
      });
      
      return { data: null, error: error as Error };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Fixed signOut function: removed return statements at the end that were causing TypeScript errors
  const signOut = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Auth state will be updated by the listener
    } catch (error) {
      errorCollector.captureError(error as Error, { 
        component: 'AuthProvider',
        source: 'signOut'
      });
      
      // No return statement here
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error: error || null };
    } catch (error) {
      return { error: error as Error };
    }
  };
  
  const updateProfile = async (profile: any) => {
    try {
      // Implementation would depend on how user profiles are stored
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Convert authState to expected AuthContextType format
  const auth: AuthContextType = {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    initialized: authState.initialized,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };
  
  return <SupabaseAuthContext.Provider value={auth}>{children}</SupabaseAuthContext.Provider>;
}

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

