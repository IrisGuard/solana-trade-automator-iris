import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { User, Session } from '@/types/auth';

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  // Function to get the current session and user
  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session: currentSession }, error: sessionError } = 
        await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      setSession(currentSession as Session | null);

      if (currentSession) {
        const { data: { user: currentUser }, error: userError } = 
          await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        setUser(currentUser as User | null);
      } else {
        setUser(null);
      }

      setError(null);
    } catch (err) {
      errorCollector.captureError(err as Error, {
        component: 'useSupabaseAuth',
        source: 'refreshSession'
      });
      
      setError(err as Error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize and set up auth state listener
  useEffect(() => {
    refreshSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession as Session | null);
        
        if (currentSession) {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          setUser(currentUser as User | null);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [refreshSession]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      errorCollector.captureError(err as Error, {
        component: 'useSupabaseAuth',
        source: 'signIn'
      });
      
      return { data: null, error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      errorCollector.captureError(err as Error, {
        component: 'useSupabaseAuth',
        source: 'signUp'
      });
      
      return { data: null, error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      return { error: null };
    } catch (err) {
      errorCollector.captureError(err as Error, {
        component: 'useSupabaseAuth',
        source: 'signOut'
      });
      
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };
}
